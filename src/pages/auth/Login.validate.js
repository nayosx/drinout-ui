import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
    username: Yup.string()
        .required('El nombre es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres'),
    password:Yup.string()
        .required('La contraseña es requerida')
        .min(4, 'La contraseña debe tener al menos 4 caracteres'),
});

export default loginSchema;