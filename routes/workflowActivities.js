const express = require('express');
const router = express.Router();
const pg = require('pg');
const soapRequest = require('easy-soap-request');
const { 
    wf_activities_order, 
    wf_activities_invoice, 
    order_detail, 
    invoice_detail,
    getUserID, 
    getCandidateUser
} = require('../query');

var array = [];

router.get('/Order/:uid', async(req, res) => {
    var query = wf_activities_order;
    var uid = [req.params.uid];
    
    console.log("WF: "+req.params.uid);
    console.log("WF: "+uid);

    const pool = new pg.Pool({
        user: process.env.DB_User,
        host: process.env.host,
        database: process.env.database,
        password: process.env.password,
        port: process.env.DB_PORT,
      });

    pool.connect((err) => {
        if(err) 
            return console.error('could not connect to postgres', err);
        
        pool.query(query, uid, (err, result) => {
            if(err) return console.error('error running query', err);

            res.send(result.rows);
            pool.end();
        });
    })
});

router.get('/Invoice/:uid', async(req, res) => {
    var query = wf_activities_invoice;
    var uid = [req.params.uid];
    
    const pool = new pg.Pool({
        user: process.env.DB_User,
        host: process.env.host,
        database: process.env.database,
        password: process.env.password,
        port: process.env.DB_PORT,
      });

    pool.connect((err) => {
        if(err) 
            return console.error('could not connect to postgres', err);
        
        pool.query(query, uid, (err, result) => {
            if(err) return console.error('error running query', err);

            res.send(result.rows);
            pool.end();
        });
    })
});

router.get('/OrderDetail/:id', async(req, res) => {
    var query = order_detail;
    var record_id = [req.params.id];
    
    const pool = new pg.Pool({
        user: process.env.DB_User,
        host: process.env.host,
        database: process.env.database,
        password: process.env.password,
        port: process.env.DB_PORT,
      });

    pool.connect((err) => {
        if(err) 
            return console.error('could not connect to postgres', err);
        
        pool.query(query, record_id, (err, result) => {
            if(err) return console.error('error running query', err);

            res.send(result.rows);
            pool.end();
        });
    })
});

router.get('/InvoiceDetail/:id', async(req, res) => {
    var query = invoice_detail;
    var record_id = [req.params.id];
    
    const pool = new pg.Pool({
        user: process.env.DB_User,
        host: process.env.host,
        database: process.env.database,
        password: process.env.password,
        port: process.env.DB_PORT,
      });

    pool.connect((err) => {
        if(err) 
            return console.error('could not connect to postgres', err);
        
        pool.query(query, record_id, (err, result) => {
            if(err) return console.error('error running query', err);

            res.send(result.rows);
            pool.end();
        });
    })
});

router.get('/getUserID/:uid', async(req, res) => {
    var query = getUserID;
    var uid = [req.params.uid];
    
    const pool = new pg.Pool({
        user: process.env.DB_User,
        host: process.env.host,
        database: process.env.database,
        password: process.env.password,
        port: process.env.DB_PORT,
      });

    pool.connect((err) => {
        if(err) 
            return console.error('could not connect to postgres', err);
        
        pool.query(query, uid, (err, result) => {
            if(err) return console.error('error running query', err);

            res.send(result.rows);
            pool.end();
        });
    })
});

router.get('/getCandidateUser', async(req, res) => {
    var query = getCandidateUser;
    
    const pool = new pg.Pool({
        user: process.env.DB_User,
        host: process.env.host,
        database: process.env.database,
        password: process.env.password,
        port: process.env.DB_PORT,
      });

    pool.connect((err) => {
        if(err) 
            return console.error('could not connect to postgres', err);
        
        pool.query(query, (err, result) => {
            if(err) return console.error('error running query', err);

            res.send(result.rows);
            pool.end();
        });
    })
});

router.get('/callTaowi/:AD_User_ID/:AD_WF_Activity_ID/:Answer/:DelegateUser_ID', async (req, res) => {
    const AD_WF_Activity_ID = req.params.AD_WF_Activity_ID;
    const AD_User_ID = req.params.AD_User_ID;
    const DelegateUser_ID = req.params.DelegateUser_ID;
    const Answer = req.params.Answer;
    const Message = req.query.Message;

    const url = 'http://149.129.220.217:9999/ADInterface/services/ModelADService?wsdl';
    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:_0="http://idempiere.org/ADInterface/1_0">
    <soapenv:Header/>
    <soapenv:Body>
    <_0:runProcess>
        <_0:ModelRunProcessRequest>
            <_0:ModelRunProcess>
                <_0:serviceType>Approval</_0:serviceType>
                <_0:ParamValues>
                <!--Zero or more repetitions:-->
                <_0:field column="AD_WF_Activity_ID">
                    <_0:val>${AD_WF_Activity_ID}</_0:val>
                </_0:field>
                <_0:field column="AD_User_ID">
                    <_0:val>${AD_User_ID}</_0:val>
                </_0:field>
                <_0:field column="DelegateUser_ID">
                    <_0:val>${DelegateUser_ID}</_0:val>
                </_0:field>
                <_0:field column="Answer">
                    <_0:val>${Answer}</_0:val>
                </_0:field>
                <_0:field column="Message">
                    <_0:val>${Message}</_0:val>
                </_0:field>
                </_0:ParamValues>
            </_0:ModelRunProcess>
            <_0:ADLoginRequest>
                <_0:user>phiealbert</_0:user>
                <_0:pass>phie2017</_0:pass>
                <_0:lang>192</_0:lang>
                <_0:ClientID>1000013</_0:ClientID>
                <_0:RoleID>1000115</_0:RoleID>
                <_0:OrgID>0</_0:OrgID>
                <_0:WarehouseID>0</_0:WarehouseID>
                <_0:stage>0</_0:stage>
            </_0:ADLoginRequest>
        </_0:ModelRunProcessRequest>
    </_0:runProcess>
    </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        const { response } = await soapRequest(url, '', xml);
        res.send(response.body);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;