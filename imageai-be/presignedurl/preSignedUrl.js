const S3 = require("aws-sdk/clients/s3");
const BUCKET_NAME = process.env.BUCKET_NAME;
const s3 = new S3();
const crypto = require("crypto");

module.exports.handler = async (event) => {
  const key = crypto.randomUUID();
  console.log("EVENT:::", event);
  try {
    let contentType = event.queryStringParameters.contentType;
    let expirationTime = 60; //1 min to test

    let params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Expires: expirationTime,
      ContentType: contentType,
    };

    const signedUrl = await s3.getSignedUrl("putObject", params);
    console.log("signedUrl", signedUrl);

    return {
      statusCode: 200,
      body: JSON.stringify({ key, signedUrl }),
    };
  } catch (error) {
    console.log(`Error: ${error}`);
    return {
      statusCode: 500,
      body: "Some error occurred..please check the logs",
    };
  }
};
