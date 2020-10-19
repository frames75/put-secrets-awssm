# Upload *Secrets* from File to AWS SSM Parameter Store

Put secret variables from a file into AWS SSM Parameter Store.

## Install

```sh
$ npm install -g put-secrets-awssm
```

## Getting started

> The AWS IAM credentials should be previously set up on the console.

Use with default parameters:

```sh
$ put-secrets-awssm put
Uploaded Param: /default-secrets/DB_PORT * Value: 3001
Uploaded Param: /default-secrets/DB_PASS * Value: user1
Uploaded Param: /default-secrets/DB_USER * Value: password
```

> Default parameters:
- Region 	 = 'eu-west-1'
- Name Space = 'default-secrets'
- File 		 = '.env'

Other usage example:

```sh
$ put-secrets-awssm put --file ./dotenv/.env --region eu-west-1
  --namespace test1
```

Preview the variables that will be saved without uploading them:

```sh
$ put-secrets-awssm --show
Parameter: DB_PORT 	 Value: 3001
Parameter: DB_USER 	 Value: user1
Parameter: DB_PASS 	 Value: password
```

Get help:

```sh
$ put-secrets-awssm put --help
put-secrets-awssm put

Put secret variables from a file into AWS SM Parameter Store. The AWS IAM
credentials should be previously set up on the console.

Options:
  --file, -f       The file name containing the variables. Default is ".env"
                                                          [string]
  --show, -s       Preview the variables that will be saved     [boolean]
  --help, -h       Muestra ayuda                                [boolean]
  --version, -v    Muestra número de versión                    [boolean]
  --region, -r     The AWS region where the variables will be saved. Default is "eu-west-1"                      [string]
  --namespace, -n  The Name Space preceding the variable name. Default is "default-secrets"                      [string]
```

## Appendix

Put parameter with AWS CLI:

```sh
$ aws ssm put-parameter --type SecureString --name awsExampleParameterSSM --value awsExampleValueSSM
```

## Issues

- Get 'region' from AWS IAM console credentials.
- Request the user AWS IAM credentials.

## Resources

[AWS SDK putParameter Method](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#putParameter-property)

[Secret Forklift](https://github.com/lukecarr/secret-forklift)

[ssmenv-cli](https://github.com/MikeBild/ssmenv-cli): Reads key/values from AWS SSM Parameter-Store and applies it to environment variables.
