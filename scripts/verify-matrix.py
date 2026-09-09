"""Compare every bundled value and identifier to the actual XLSX source cells."""
import hashlib
import json
from pathlib import Path
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[1]
NS = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}


def verify():
    data = json.loads((ROOT / 'public/data/hcp-connectome.json').read_text(encoding='utf-8'))
    workbook = ROOT / 'public/data/tract_to_region_connectome_MMP.xlsx'
    assert hashlib.sha256(workbook.read_bytes()).hexdigest() == data['provenance']['sourceSha256']
    with zipfile.ZipFile(workbook) as archive:
        strings = [''.join(si.itertext()) for si in ET.fromstring(archive.read('xl/sharedStrings.xml'))]
        sheet = ET.fromstring(archive.read('xl/worksheets/sheet1.xml'))
        cells = {}
        for cell in sheet.findall('.//s:sheetData/s:row/s:c', NS):
            value = cell.find('s:v', NS)
            if value is None:
                continue
            cells[cell.attrib['r']] = strings[int(value.text)] if cell.get('t') == 's' else float(value.text)
    count = 0
    for tract in data['tracts']:
        assert cells[f"{tract['sourceColumn']}2"] == tract['code']
    for region in data['regions']:
        identifier = cells[f"A{region['sourceRow']}"]
        if isinstance(identifier, float) and identifier.is_integer():
            identifier = str(int(identifier))
        assert identifier == region['id']
        for tract in data['tracts']:
            source = cells[f"{tract['sourceColumn']}{region['sourceRow']}"]
            actual = data['values'][region['rowIndex']][tract['columnIndex']]
            assert source == actual, (region['id'], tract['id'], source, actual)
            count += 1
    assert count == 9360
    print(f'XLSX comparison passed: {count}/{count} exact numeric values, 180 row IDs, 52 column IDs.')


if __name__ == '__main__':
    verify()
