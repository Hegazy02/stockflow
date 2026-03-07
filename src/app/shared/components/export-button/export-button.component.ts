import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Download } from 'lucide-angular';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-export-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './export-button.component.html',
  styleUrls: ['./export-button.component.scss']
})
export class ExportButtonComponent {

  @Input() data: any[] = [];
  @Input() fileName: string = 'export';
  @Input() label: string = 'Export to Excel';
  @Input() disabled: boolean = false;

  readonly Download = Download;

  async exportToExcel(): Promise<void> {

    if (!this.data || this.data.length === 0) {
      console.warn('No data to export');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const headers = Object.keys(this.data[0]);

    // Define worksheet columns explicitly
    worksheet.columns = headers.map(header => ({
      header: header,
      key: header,
      width: header.length + 3
    }));

    const headerRow = worksheet.getRow(1);

    // Header styling
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 25;

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F46E5' }
      };

      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      };
    });

    // Add data rows
    this.data.forEach((item, index) => {

      const row = worksheet.addRow(item);
      const isEvenRow = (index + 2) % 2 === 0;

      row.height = 20;

      row.eachCell({ includeEmpty: false }, (cell) => {

        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: isEvenRow ? 'FFF8FAFC' : 'FFFFFFFF' }
        };

        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };

        cell.alignment = { vertical: 'middle' };
      });

    });

    // Auto column width
    worksheet.columns.forEach(column => {

      let maxLength = column.header
        ? column.header.toString().length
        : 10;

      column.eachCell!({ includeEmpty: false }, cell => {

        const cellValue = cell.value
          ? cell.value.toString()
          : '';

        maxLength = Math.max(maxLength, cellValue.length);
      });

      column.width = Math.min(maxLength + 2, 30);
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob(
      [buffer],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    );

    const timestamp = new Date().toISOString().split('T')[0];
    const fullFileName = `${this.fileName}_${timestamp}.xlsx`;

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fullFileName;
    link.click();

    window.URL.revokeObjectURL(url);
  }
}