import { google } from 'googleapis';

const serviceAccountKeyFile = "./google-creds.json";
const spreadsheetId = '1rwUfPt01jxdA7_90siPkefnI5Rjbq9g2FTbvepTTap8'; // Replace with the extracted spreadsheet ID
const tabName = 'Users';
const range = 'A:E';

async function getGoogleSheetClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountKeyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: auth });

  try {
    // Get values from the specified range in the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: 'A1:Z1000' // Use the tabName and range variables
    });

    const values = response.data.values;

    if (values.length) {
      // Values are available, you can process them here
      console.log('Data from Google Sheets:', values);
    } else {
      console.log('No data found.');
    }
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
  }
}

async function insertData() {
  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountKeyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: auth });

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      range: 'A1:Z1000',
      requestBody: {
        values: [['asdasd'], ['81g912e9'], ["lkjnsdaa98dh239u2"]]
      }
    });

    console.log('Data inserted successfully:', response.data);
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}


// Call the function to get data from Google Sheets
getGoogleSheetClient();
