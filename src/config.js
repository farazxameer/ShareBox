export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "ap-south-1",
    BUCKET: "sharebox-app-upload"
  },
  apiGateway: {
    REGION: "ap-south-1",
    URL: "https://7megdztqje.execute-api.ap-south-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "ap-south-1",
    USER_POOL_ID: "ap-south-1_7xrzSFhsl",
    APP_CLIENT_ID: "sdla6d7mtnvol60rg2ceblvea",
    IDENTITY_POOL_ID: "ap-south-1:48644e8c-222e-48b3-ad49-70280310f815"
  }
};
