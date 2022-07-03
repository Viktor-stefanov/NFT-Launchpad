import { create } from "ipfs-http-client";

async function uploadFileToIPFS(data) {
  const client = create("https://ipfs.infura.io:5001/api/v0");
  try {
    const { cid, path } = await client.add(data);
    return { cid, path };
  } catch (err) {
    console.log("Error on uploading the file to IPFS: " + err);
  }
}

async function retrieveFileFromIPFS(CID) {
  const client = create("https://ipfs.infura.io:5001/api/v0");
  try {
    const file = await client.dag.cat(CID);
    return file;
  } catch (err) {
    console.log("Error on retrieving file from IPFS: " + err);
  }
}

export { uploadFileToIPFS, retrieveFileFromIPFS };
