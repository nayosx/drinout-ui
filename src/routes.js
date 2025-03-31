const routes = {
  login: {
    label: 'Inicio de Sesión',
    path: '/',
    showInSidebar: false
  },
  me: {
    label: 'Perfil',
    path: '/me',
    showInSidebar: false
  },
  home: {
    label: 'Inicio',
    path: '/home',
    showInSidebar: false
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
      showInSidebar: false
    },
    add: {
      label: 'Agregar Transacción',
      path: '/transactions/add',
      showInSidebar: false
    },
    edit: {
      label: 'Editar Transacción',
      path: '/transactions/edit/:id',
      showInSidebar: false
    }
  },
  workSession: {
    home: {
      label: 'Daylog',
      path: '/work-session',
      showInSidebar: true
    },
    report: {
      label: 'Reporte de Trabajo',
      path: '/work-session/report',
      showInSidebar: false
    }
  }
};

export default routes;
