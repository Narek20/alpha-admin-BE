import xlsx from 'xlsx'

export const readExcelData = (filePath: string): any[] => {
  const workbook = xlsx.readFile(filePath)
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const jsonData = xlsx.utils.sheet_to_json(worksheet)
  return jsonData
}
