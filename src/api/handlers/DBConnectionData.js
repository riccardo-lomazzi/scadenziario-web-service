class DBConnectionData {

    static getUser() {
        return 'your_user';
    }

    static getPassword() {
        return 'your_pw'
    }

    static getHost() {
        return 'host_name';
    }

    static getPort() {
        return 'port'; //3306 default for MySQL
    }

    //get dbconnectiondata
    static getConnectionData() {
        return {
            user: this.getUser(),
            password: this.getPassword(),
            host: this.getHost(),
            port: this.getPort(),
            database: 'scadenziario',
            dateStrings: true, 
        };
    }

    static createMasks(arr) {
        return new Array(arr.length).fill('?').join(',');
    }
}

export default DBConnectionData;