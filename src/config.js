export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "ap-south-1",
    BUCKET: "sharebox-files-bucket"
  },
  apiGateway: {
    REGION: "ap-south-1",
    URL: "https://ylizg2zq65.execute-api.ap-south-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "ap-south-1",
    USER_POOL_ID: "ap-south-1_htyoykdtT",
    APP_CLIENT_ID: "6fc31nohsrojqrn6is314p93kd",
    IDENTITY_POOL_ID: "ap-south-1:f0894763-0008-44c3-a9b5-36caa789caa4"
  }
};
