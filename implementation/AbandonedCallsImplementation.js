//var AbandonedCallsImplementation = require('../implementation/AbandonedCallsImplementation');


exports.put = function (service, day, apiKey, country, from, to, threshold) {
  return new Promise((resolve, reject) => {


    console.log('\n\n--------------------- LOG -----------------------\n ');
    console.log("\n Entrando a ABANDONED Calls Implementation... \n");

    var mysql = require('mysql'); // Incluimos el modulo de MySQL
    var crypto = require('crypto'); //Hash MD5

    var servicio = service;

    if (service == 'GSS-USA') {
      servicio = 'USA';
    }

    var fecha = day;

    var pais = country;

    var horaInicio = from;

    var horaFinal = to;

    var limite = threshold;

    var key = apiKey;

    passwordHash = crypto.createHash('md5').update(key).digest("hex");
    //console.log('El password MD5 es --->' + passwordHash);

    var numeroServicio = 1;

    var keyBD = "";
    var connectionAPI = mysql.createConnection({
      host: 'localhost',
      user: 'apiUser',
      password: '4P12018.txm@',
      database: 'api',
      port: 3306
    });

    connectionAPI.connect(function (error) {
      if (error) {
        console.log('Error de conexion a la BD');
      } else {
        //console.log('Conexion correcta a API');
      }
    });

    var promesaConAPI = new Promise((resolve, reject) => { // PROMESA PARA CONEXION API BD

      // SELECT PARA VALIDAR EL API KEY
      var queryString = 'SELECT apikey as llave from apikey where id= ?';
      connectionAPI.query(queryString, [numeroServicio], function (err, rows, fields) {
        console.log(queryString);
        if (err) throw err;
        var apiKeyBD = rows[0].llave;
        console.log('API KEY de la BD' + apiKeyBD);

        if (apiKeyBD == passwordHash) {
          console.log('\n Las contraseñas coinciden');
          resolve(apiKeyBD); //Usamos el result para que se ejecute la otra siguiente promesa

        } else {
          console.log('\n Las contraseñas NO coinciden');
          reject('LAS CONTRASEÑAS NO COINCIDEN REJECT!'); //usamos el Reject para no enviar nada en el resultado 
        }
      }) // SE CIERRA LA CONSULTA A API
    }); // SE CIERRA LA CONEXION A API BD

    console.log('\n ESPACIO ENTRE LAS 2 PROMESAS \n ');

    var promesaCDR = (apiKeyValidation) => { // SEGUNDA PROMESA
      return new Promise((resolve, reject) => { // PROMESA PARA CONEXION EN CDR

        var connectionCDR = mysql.createConnection({
          host: 'localhost',
          user: 'apiUser',
          password: '4P12018.txm@',
          database: 'cdr',
          port: 3306
        });

        connectionCDR.connect(function (error) {
          if (error) {
            reject();
          } else {
            console.log('\n Conexion correcta a CDR');
          }

          // ------------------------------------------------------------- VALIDACIONES-------------------- --------------------------------------------------- ////

          // SI no recibe hora inicio y final 
          if (servicio != null && fecha != null && pais == null && horaInicio == null && horaFinal == null && limite == null && key != null) {
            console.log("\n Consulta solo para SERVICIO Y FECHA (pais)");

            if (service == 'GSS-USA') {
              country = 'Mexico';
            }

            var queryString = 'SELECT COUNT(*) AS Total FROM cdr WHERE calldate LIKE "' + [fecha] + '%" AND lastapp="Queue" AND dstchannel="" AND accountcode LIKE "%' + servicio + '%"';
            connectionCDR.query(queryString, [fecha], function (err, rows, fields) {
              console.log(queryString);
              if (err) throw err;
              var Total = rows[0].Total;
              console.log('Total llamadas abandonadas: ' + Total);

              item = [];
              for (var i in rows) {
                service = service;
                day = fecha;
                country = country;
                callsAbandoned = Total;
                from = null;
                to = null;
                threshold = null;
                informacion = new datosObtenidos(service, day, country, callsAbandoned, from, to, threshold);
                item.push(informacion);
                console.log(item[i]);
              }

              if (item != []) {
                resolve(item)
              } else {
                reject()
              }
            })
          }

          if (servicio != null && fecha != null && pais != null && horaInicio == null && horaFinal == null && limite == null && key != null) {
            console.log("\n Consulta solo para SERVICIO, FECHA Y PAIS");
            reject();
          }

          if (servicio != null && fecha != null && limite != null && pais == null && horaInicio == null && horaFinal == null && key != null) {
            console.log("\n Consulta solo para SERVICIO, FECHA Y LIMITE");

            if (service == 'GSS-USA') {
              country = 'Mexico';
            }

            var queryString = 'SELECT COUNT(*) AS Total FROM cdr WHERE calldate LIKE "' + [fecha] + '%" AND lastapp="Queue" AND dstchannel="" AND accountcode LIKE "%' + servicio + '%" AND billsec <= ' + limite + '';
            connectionCDR.query(queryString, [fecha], function (err, rows, fields) {
              console.log(queryString);
              if (err) throw err;
              var Total = rows[0].Total;
              console.log('Total llamadas abandonadas: ' + Total);

              item = [];
              for (var i in rows) {
                service = service;
                day = fecha;
                country = country;
                callsAbandoned = Total;
                from = null;
                to = null;
                threshold = limite;
                informacion = new datosObtenidos(service, day, country, callsAbandoned, from, to, threshold);
                item.push(informacion);
                console.log(item[i]);
              }

              if (item != []) {
                resolve(item)
              } else {
                reject()
              }
            })
          }


          if (servicio != null && fecha != null && limite != null && pais != null && horaInicio == null && horaFinal == null && key != null) {
            console.log("\n Consulta solo para SERVICIO, FECHA, PAIS Y LIMITE");
            reject();
          }


          // SI RECIBE HORA INICIO Y FINAL

          if (servicio != null && fecha != null && pais != null && horaInicio != null && horaFinal != null && limite == null && key != null) {
            console.log("\n Consulta solo para SERVICIO, FECHA, PAIS, HORA INICIO Y FINAL");
          }

          if (servicio != null && fecha != null && pais == null && horaInicio != null && horaFinal != null && limite != null) {
            console.log("\n Consulta solo para SERVICIO, FECHA, LIMITE, HORA INICIO Y FINAL");
            if (service == 'GSS-USA') {
              country = 'Mexico';
            }
            var queryString = 'SELECT COUNT(*) AS Total FROM cdr WHERE calldate LIKE "' + [fecha] + '%" AND lastapp="Queue" AND dstchannel=" " AND accountcode LIKE "%' + servicio + '%" AND calldate BETWEEN " ' + [fecha] + ' ' + [horaInicio] + '" AND "' + [fecha] + ' ' + [horaFinal] + '" AND BILLSEC <= ' + limite + '';
            connectionCDR.query(queryString, [fecha], function (err, rows, fields) {
              console.log(queryString);
              if (err) throw err;
              var Total = rows[0].Total;
              console.log('Total llamadas abandonadas: ' + Total);

              item = [];
              for (var i in rows) {
                service = service;
                day = fecha;
                country = country;
                callsAbandoned = Total;
                from = null;
                to = null;
                threshold = limite;
                informacion = new datosObtenidos(service, day, country, callsAbandoned, from, to, threshold);
                item.push(informacion);
                console.log(item[i]);
              }

              if (item != []) {
                resolve(item)
              } else {
                reject()
              }
            })
          }


          if (servicio != null && fecha != null && pais == null && horaInicio != null && horaFinal != null && limite == null) {
            console.log("\n Consulta solo para SERVICIO, FECHA, HORA INICIO Y FINAL");

            if (service == 'GSS-USA') {
              country = 'Mexico';
            }

            var queryString = 'SELECT COUNT(*) AS Total FROM cdr WHERE calldate LIKE "' + [fecha] + '%" AND lastapp="Queue" AND dstchannel="" AND accountcode LIKE "%' + service + '%" AND calldate BETWEEN " ' + [fecha] + ' ' + [horaInicio] + '" AND "' + [fecha] + ' ' + [horaFinal] + '"';
            connectionCDR.query(queryString, [fecha], function (err, rows, fields) {
              console.log(queryString);
              if (err) throw err;
              var Total = rows[0].Total;
              console.log('Total llamadas abandonadas: ' + Total);

              item = [];
              for (var i in rows) {
                service = service;
                day = fecha;
                country = country;
                callsAbandoned = Total;
                from = null;
                to = null;
                threshold = limite;
                informacion = new datosObtenidos(service, day, country, callsAbandoned, from, to, threshold);
                item.push(informacion);
                console.log(item[i]);
              }

              if (item != []) {
                resolve(item)
              } else {
                reject()
              }
            })
          }


          // Si recibe solo la hora inicial
          if (servicio != null && fecha != null && pais != null && horaInicio != null && horaFinal != null && limite != null) {
            console.log("\n Consulta todos los parametros");
            reject();
          }

          if (servicio != null && fecha != null && pais != null && horaInicio != null && horaFinal == null && limite == null) {
            console.log("\n --> ERROR: Es necesario una hora final (viene pais)");
            reject();
          }

          if (servicio != null && fecha != null && pais == null && horaInicio != null && horaFinal == null && limite != null) {
            console.log("\n --> ERROR: Es necesario una hora final (viene limite)");
            reject();
          }

          if (servicio != null && fecha != null && pais == null && horaInicio != null && horaFinal == null && limite == null) {
            console.log("--> ERROR: Es necesario una hora final (falta pais y limite)");
            reject();
          }

          if (servicio != null && fecha != null && pais != null && horaInicio != null && horaFinal == null && limite != null) {
            console.log("\n --> ERROR: Es necesario una hora final (viene pais y limite)");
            reject();
          }


          // Si recibe solo la hora final

          if (servicio != null && fecha != null && pais != null && horaInicio == null && horaFinal != null && limite == null) {
            console.log("\n --> ERROR: Es necesario una hora final inicial (viene pais)");
            reject();
          }

          if (servicio != null && fecha != null && pais == null && horaInicio == null && horaFinal != null && limite != null) {
            console.log("\n --> ERROR: Es necesario una hora inicial (viene limite)");
            reject();
          }

          if (servicio != null && fecha != null && pais == null && horaInicio == null && horaFinal != null && limite == null) {
            console.log("--> ERROR: Es necesario una hora inicial (falta pais y limite)");
            reject();
          }

          if (servicio != null && fecha != null && pais != null && horaInicio == null && horaFinal != null && limite != null) {
            console.log("\n --> ERROR: Es necesario una hora inicial (viene pais y limite)");
            reject();
          }

        });


      }) // SE CIERRA LA PROMESA A CONEXION CDR
    } // SE CIERRA LA SEGUNDA PROMESA

    function datosObtenidos(service, day, country, callsAbandoned, from, to, threshold) {
      this.service = service;
      this.day = day;
      this.country = country;
      this.callsAbandoned = callsAbandoned;
      this.from = from;
      this.to = to;
      this.threshold = threshold;
    }


    promesaConAPI.then((result) => {
        console.log('Antes de la promesa CDR');
        return promesaCDR(result);
      }).catch((err) => {
        reject("Error en conexion a API");
      })
      .then((resultadoFinal) => {
        //console.log(resultadoFinal, 'RESULTADO FINAL')
        resolve(JSON.stringify(resultadoFinal))
      }).catch((err) => {
        reject("Error en conexion a CDR");
      })


  }) // SE CIERRA LA PROMESA PRINCIPAL

}