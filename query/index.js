const wf_activities_order = 
`SELECT Record_ID, AD_Table_ID, AD_WF_Activity_id, a.AD_User_ID,
co.documentNo, co.grandTotal,
(SELECT name FROM C_DocType WHERE C_DocType_ID = co.C_DocType_ID) as docType,
(SELECT name FROM C_BPartner WHERE C_BPartner_ID = co.C_Bpartner_ID) as bpName,
(SELECT name FROM AD_User WHERE AD_User_ID = co.createdby) as createdBy,
ad_table_id
FROM AD_WF_Activity a 
JOIN C_Order co ON co.C_Order_ID = Record_ID
WHERE AD_Table_ID = 259 AND a.AD_Client_ID=1000013 AND a.Processed='N' AND a.WFState='OS' AND ( 
    EXISTS ( 
        SELECT 1 
        FROM AD_WF_ActivityApprover r 
        JOIN AD_User au ON au.AD_User_ID = r.AD_User_ID
        WHERE a.AD_WF_Activity_ID=r.AD_WF_Activity_ID AND au.uid=$1 AND r.isActive = 'Y' AND isApproved='N'
        AND Sequence=(
                SELECT COALESCE(MIN(Sequence),0) 
                    FROM AD_WF_ActivityApprover r2 
                    WHERE a.AD_WF_Activity_ID=r2.AD_WF_Activity_ID  AND r2.isApproved='N'
    )))
ORDER BY a.Priority DESC, a.Created`;

const wf_activities_invoice = 
`SELECT Record_ID, AD_Table_ID, AD_WF_Activity_id, a.AD_User_ID,
ci.documentNo, ci.grandTotal,
(SELECT name FROM C_DocType WHERE C_DocType_ID = ci.C_DocType_ID) as docType,
(SELECT name FROM C_BPartner WHERE C_BPartner_ID = ci.C_Bpartner_ID) as bpName,
(SELECT name FROM AD_User WHERE AD_User_ID = ci.createdby) as createdBy,
ad_table_id
FROM AD_WF_Activity a 
JOIN C_Invoice ci ON ci.C_Invoice_ID = Record_ID
WHERE AD_Table_ID = 318 AND a.AD_Client_ID=1000013 AND a.Processed='N' AND a.WFState='OS' AND ( 
    EXISTS ( 
        SELECT 1 
        FROM AD_WF_ActivityApprover r 
        JOIN AD_User au ON au.AD_User_ID = r.AD_User_ID
        WHERE a.AD_WF_Activity_ID=r.AD_WF_Activity_ID AND au.uid=$1 AND r.isActive = 'Y' AND isApproved='N'
        AND Sequence=(
                SELECT COALESCE(MIN(Sequence),0) 
                    FROM AD_WF_ActivityApprover r2 
                    WHERE a.AD_WF_Activity_ID=r2.AD_WF_Activity_ID  AND r2.isApproved='N'
    )))
ORDER BY a.Priority DESC, a.Created`;

const order_detail = 
`SELECT col.C_OrderLine_ID, col.C_Order_ID, co.dateOrdered, co.description as headerDescription,
(SELECT name FROM M_Warehouse WHERE M_Warehouse_ID = co.M_Warehouse_ID) as warehouse,
(SELECT iso_code FROM C_Currency WHERE C_Currency_ID = co.C_Currency_ID) as currency,
mp.name as product, cc.name as charge, qtyordered, qtyentered, priceentered, pricelist, priceactual, discount,
(SELECT name FROM C_UOM WHERE C_UOM_ID = col.C_UOM_ID) as uom, ct.name as taxline, cth.name as taxheader,
col.description as lineDescription
FROM C_OrderLine col
JOIN C_Order co ON co.C_Order_ID = col.C_Order_ID
LEFT JOIN M_Product mp ON mp.M_Product_ID = col.M_Product_ID
LEFT JOIN C_Charge cc ON cc.C_Charge_ID = col.C_Charge_ID
LEFT JOIN C_Tax ct ON col.C_Tax_ID = ct.C_Tax_ID
LEFT JOIN C_Tax cth ON cth.C_Tax_ID = co.C_Tax_ID
WHERE col.C_Order_ID=$1
`;

const invoice_detail = 
`SELECT cil.C_InvoiceLine_ID, cil.C_Invoice_ID, ci.dateInvoiced, ci.dateacct, ci.description as headerdescription, ci.docstatus,
(SELECT iso_code FROM C_Currency WHERE C_Currency_ID = ci.C_Currency_ID) as currency,
mp.name as product, cc.name as charge, qtyinvoiced, qtyentered, pricelist, priceactual, priceentered, 
(SELECT name FROM C_UOM WHERE C_UOM_ID = cil.C_UOM_ID) as uom, ct.name as taxline, cth.name as taxheader,
cil.description as lineDescription, cil.istrackasasset, cil.discount, cil.discountamt,
(SELECT name FROM A_Asset_Group WHERE A_Asset_Group_ID = cil.A_Asset_Group_ID) as assetgroup
FROM C_Invoice ci
JOIN C_InvoiceLine cil ON ci.C_Invoice_ID = cil.C_Invoice_ID
LEFT JOIN M_Product mp ON mp.M_Product_ID = cil.M_Product_ID
LEFT JOIN C_Charge cc ON cc.C_Charge_ID = cil.C_Charge_ID
LEFT JOIN C_Tax ct ON cil.C_Tax_ID = ct.C_Tax_ID
LEFT JOIN C_Tax cth ON cth.C_Tax_ID = ci.C_Tax_ID
WHERE cil.C_Invoice_ID=$1
`;

const getUserID = 
`SELECT AD_User_ID FROM AD_User WHERE UID=$1`;

const getCandidateUser = 
`SELECT AD_User_ID as value, name as label 
FROM AD_USER WHERE isCandidateForward = 'Y' AND AD_Client_ID = 1000013
Order by name`;

module.exports.wf_activities_order = wf_activities_order;
module.exports.wf_activities_invoice = wf_activities_invoice;
module.exports.order_detail = order_detail;
module.exports.invoice_detail = invoice_detail;
module.exports.getUserID = getUserID;
module.exports.getCandidateUser = getCandidateUser;