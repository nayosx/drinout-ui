const routes = {
    login: "/",
    me: "/me",
    home: "/home",
    notFound: "*",
    transaction: {
      list: "/transactions",
      add: "/transactions/add",
      edit: "/transactions/edit/:id",
    },

  };
  
export default routes;
  