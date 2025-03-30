const routes = {
  login: {
    label: 'Inicio de Sesión',
    path: '/',
    showInSidebar: false
  },
  me: {
    label: 'Perfil',
    path: '/me',
    showInSidebar: true
  },
  home: {
    label: 'Inicio',
    path: '/home',
    showInSidebar: true
  },
  notFound: {
    label: 'No encontrado',
    path: '*',
    showInSidebar: false
  },
  transaction: {
    list: {
      label: 'Lista de Transacciones',
      path: '/transactions',
      showInSidebar: true
    },
    add: {
      label: 'Agregar Transacción',
      path: '/transactions/add',
      showInSidebar: true
    },
    edit: {
      label: 'Editar Transacción',
      path: '/transactions/edit/:id',
      showInSidebar: false
    }
  },
  workSession: {
    home: {
      label: 'Sesiones de Trabajo',
      path: '/work-session',
      showInSidebar: true
    },
    report: {
      label: 'Reporte de Trabajo',
      path: '/work-session/report',
      showInSidebar: true
    }
  }
};

export default routes;
