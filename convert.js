import xlsx from 'node-xlsx';
import { stringify } from 'csv-stringify';
import fsPromises from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const PRODUCTS_FILENAME = 'products.xls';
const productsPath = path.join(process.cwd(), 'data', PRODUCTS_FILENAME);
const outputPath = path.join(process.cwd(), 'data', 'products.csv');
const productsXls = await fsPromises.readFile(productsPath);
const xlsArray = xlsx.parse(productsXls);
const data = [];
const stringifier = stringify({});

stringifier.on('readable', () => {
  let row;
  while ((row = stringifier.read()) !== null) {
    data.push(row);
  }
});
stringifier.on('error', (err) => console.error(err));
stringifier.on('finish', async () => {
  await fsPromises.writeFile(outputPath, data.join(os.EOL));
});

xlsArray.forEach((row) => {
  const rowData = row.data;
  rowData.forEach((el) => {
    const elData = el.map((x) => {
      return typeof x === 'string' ? x.trim() : x;
    });
    stringifier.write(elData);
  });
});
stringifier.end();
