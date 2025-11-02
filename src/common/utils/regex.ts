const EMAIL_REGEX: RegExp =
/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX: RegExp =  /^(?=.*[A-Za-z])(?=.*\d)[\s\S]{8,32}$/;

export { EMAIL_REGEX, PASSWORD_REGEX };

