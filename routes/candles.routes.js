const {Router} = require('express')
const {Container} =  require ("typedi")
const CardService = require("../service/card");
const router = Router()

router.get("/cards", async (req, res) => {
    const cardService = Container.get(CardService);
    const cards = await cardService.get().catch(error => {
      return res.status(500).json({ error });
    });

    return res.status(200).json(cards);
});

router.get("/card/:cardId", async (req, res) => {
    const cardService = Container.get(CardService);
    const card = await cardService.getById(req.params.cardId).catch(error => {
      return res.status(500).json({ error });
    });

    return res.status(200).json(card);
});

router.post("/card/:cardId/clone", async (req, res) => {
    const cardService = Container.get(CardService);

    const { cardId } = req.body;

    const card = await cardService.getById(cardId);

    const { title, listId } = card;

    const cards = await cardService.get({ listId })

    const cardCopy = await cardService.create({ title, listId, sortOrder: cards.length + 1 }).catch(error => {
      return res.status(500).json({ error });
    });

    return res.status(200).json(cardCopy);
});

router.post("/card/create", async (req, res) => {
    const cardService = Container.get(CardService);

    const { title, content, listId } = req.body;

    const cards = await cardService.get({ listId });

    const card = await cardService
      .create({
        title,
        content,
        listId,
        sortOrder: cards.length + 1,
      })
      .catch(error => {
        return res.status(500).json({ error });
      });

    return res.status(201).json(card);
});

router.patch("/card/update", async (req, res) => {
    const cardService = Container.get(CardService);

    const { cardId } = req.params;

    const card = await cardService
      .update(cardId, req.body)
      .catch(error => {
        return res.status(500).json({ error });
      });

    return res.status(200).json(card);
});


router.patch("/card/:cardId/update", async (req, res) => {
    const cardService = Container.get(CardService);

    const { cardId } = req.params;

    const card = await cardService
      .update(cardId, req.body)
      .catch(error => {
        return res.status(500).json({ error });
      });

    return res.status(200).json(card);
});

router.delete("/card/:cardId/delete", async (req, res) => {
    const cardService = Container.get(CardService);

    const { cardId } = req.params;

    const card = await cardService.delete(cardId).catch(error => {
      return res.status(500).json({ error });
    });

    return res.status(204).json(card);
});


module.exports = router