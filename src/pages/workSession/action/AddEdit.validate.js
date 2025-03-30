import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    detail: Yup.string().required('La descripción es obligatoria.')
                .min(5, 'La descripción debe tener al menos 5 caracteres.'),
    amount: Yup.number()
      .required('El monto es obligatorio.')
      .positive('El monto debe ser mayor a 0.')
      .max(9999999, 'El monto no puede exceder 9,999,999.')
      .test(
        'max-decimals',
        'El monto solo puede tener hasta 2 decimales.',
        (value) => /^\d+(\.\d{1,2})?$/.test(value)
      ),
    paymentType: Yup.string().required('Debe seleccionar un tipo de pago.'),
    transactionType: Yup.string().required(
      'Debe seleccionar el tipo de transacción (IN o OUT).'
    ),
});

export default validationSchema;