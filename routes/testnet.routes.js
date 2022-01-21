const {Router} = require('express')
const router = Router()
const axios =require('axios');

router.post("/order", async (req, res) => {
    try {
        const result = await axios({
            method:'POST',
            url: req.body.key,
            headers: { 'X-MBX-APIKEY': req.body.apiKey }
        });
        return res.status(200).json(result.data);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err });
    }

});

router.post("/balance", async (req, res) => {
        try {
            const result = await axios({
                method:'GET',
                url: req.body.key,
                headers: { 'X-MBX-APIKEY': req.body.apiKey }
            });
            return res.status(200).json(result.data);
             
        } catch (err) {
            console.log(err)
            return res.status(500).json({ err });
        }
});

router.post("/account", async (req, res) => {
    try {
        const result = await axios({
            method:'GET',
            url: req.body.key,
            headers: { 'X-MBX-APIKEY': req.body.apiKey }
        });
        return res.status(200).json(result.data);
         
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err });
    }
});

router.post("/leverage", async (req, res) => {
    try {
        const result = await axios({
            method:'POST',
            url: req.body.key,
            headers: { 'X-MBX-APIKEY': req.body.apiKey }
        });
        return res.status(200).json(result.data);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err });
    }

});

router.post("/listenkey", async (req, res) => {
    try {
        const result = await axios({
            method:'POST',
            url: req.body.key,
            headers: { 'X-MBX-APIKEY': req.body.apiKey }
        });
        return res.status(200).json(result.data);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err });
    }

});

router.put("/listenkeyupdate", async (req, res) => {
    try {
        const result = await axios({
            method:'PUT',
            url: req.body.key,
            headers: { 'X-MBX-APIKEY': req.body.apiKey }
        });
        return res.status(200).json(result.data);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err });
    }

});

router.post("/deleteorders", async (req, res) => {
    try {
        const result = await axios({
            method:'DELETE',
            url: req.body.key,
            headers: { 'X-MBX-APIKEY': req.body.apiKey }
        });
        return res.status(200).json(result.data);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err });
    }

});

router.post("/allorders", async (req, res) => {
    try {
        const result = await axios({
            method:'GET',
            url: req.body.key,
            headers: { 'X-MBX-APIKEY': req.body.apiKey }
        });
        return res.status(200).json(result.data);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err });
    }

});

module.exports = router ;