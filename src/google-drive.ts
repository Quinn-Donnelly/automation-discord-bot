import {google} from 'googleapis';
import {tokenPath} from '../config.json'
import {authenticate} from '@google-cloud/local-auth';
import path from 'path';

const drive = google.drive('v3');
const TOKEN_PATH = tokenPath;


async function runSample() {
  // Obtain user credentials to use for the request
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, '../'+ tokenPath),
    scopes: 'https://www.googleapis.com/auth/drive.metadata.readonly',
  });
  google.options({auth});

  let res: any;
  let id;
  try {
    res = await drive.files.list({
      pageSize: 10,
      q: "trashed = false and mimeType = 'application/vnd.google-apps.folder' and name contains 'weight'",
      fields: "nextPageToken, files(id)"
    });
    console.log(res.data);
    id = res.data.files[0].id;

    const photoList = await drive.files.list({
      pageSize: 10,
      q: `'${id}' in parents and mimeType contains 'image'`,
      fields: "nextPageToken, files(id, createdTime, name)",
      orderBy: "createdTime"
    });
    console.log(photoList.data)
    const listOfPhotos = photoList.data.files as Array<Object>;
    const recentPic = listOfPhotos[0] as any;
    const oldPic = listOfPhotos[listOfPhotos.length - 1] as any;

    console.log(`recent id = ${recentPic.id} name = ${recentPic.name}`);
    console.log(`old id = ${oldPic.id} name = ${oldPic.name}`);
  } catch (e) {
    console.error("error listing files from google drive", e);
    return null;
  }

  return res.data;
}

if (module === require.main) {
  runSample().catch(console.error);
}

export default runSample;