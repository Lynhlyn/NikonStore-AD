import { AnyObject, ObjectSchema } from 'yup';

export const getFieldsFromSchema = <T extends AnyObject>(
  schema: ObjectSchema<T>
): (keyof T)[] => {
  const description = schema.describe();
  return Object.keys(description.fields) as (keyof T)[];
};

export const getErrors = <T extends AnyObject>(
  error: any,
  setError: any,
  schema: ObjectSchema<T>
) => {
  const fields = getFieldsFromSchema<T>(schema);

  if (error.data?.data && typeof error.data.data === 'object' && Object.keys(error.data.data).length > 0) {
    const hasMatchingField = Object.keys(error.data.data).some((field) =>
      fields.includes(field)
    );

    Object.entries(error.data.data).forEach(
      ([field, message]: [string, unknown]) => {
        const messageStr = message as string;
        if (fields.includes(field)) {
          setError(field, { message: messageStr });
        }
      }
    );

    if (!hasMatchingField) {
      const firstEntry = Object.entries(error.data.data)[0];
      return firstEntry ? (firstEntry[1] as string) : 'Có gì đó không ổn';
    }
  }

  if (error.data?.message && typeof error.data.message === 'object') {
    const hasMatchingField = Object.keys(error.data.message).some((field) =>
      fields.includes(field)
    );

    Object.entries(error.data.message).forEach(
      ([field, message]: [string, unknown]) => {
        const messageStr = message as string;
        if (fields.includes(field)) {
          setError(field, { message: messageStr });
        }
      }
    );

    if (!hasMatchingField) {
      const firstEntry = Object.entries(error.data.message)[0];
      return firstEntry ? (firstEntry[1] as string) : 'Có gì đó không ổn';
    }
  }

  if (error.data?.message && typeof error.data.message === 'string') {
    return error.data.message;
  }

  if (error.message && typeof error.message === 'string') {
    return error.message;
  }

  if (error.data && typeof error.data === 'string') {
    return error.data;
  }

  return 'Đã xảy ra lỗi';
};

