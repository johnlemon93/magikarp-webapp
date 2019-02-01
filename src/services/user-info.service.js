let listeners = [];

let user = (() => {
    let dataString = localStorage.getItem('user-info');
    let user = dataString === null || dataString === 'undefined' ?
        null :
        JSON.parse(dataString);
    if (user === null || !user.token) {
        return null;
    }
    return user;
})();

const userInfoService = {
    getUser: () => user,
    setUser: (newUser) => {
        user = newUser;

        if (user) {
            localStorage.setItem("user-info", JSON.stringify(user));
        } else {
            localStorage.removeItem("user-info");
        }

        listeners.forEach(l => l(user));
    },
    onChange: (cb) => {
        listeners.push(cb);
        // return a function to unsubscribe the event
        return () => {
            const i = listeners.indexOf(cb);
            if (i === -1) return;
            listeners.splice(i, 1);
        }
    },
};

export default userInfoService;