
// return card related to block
import React from "react";

export function groupByBlocks(cards, blockName) {

    let cardIds = [];
    let result1 = [];

// only active block active cards
    let active = blockName.cards.filter(function (item) {
        return item.active > 0;
    });

// ordering block cards
    let orderedCards = active.sort((a, b) => a.cardOrder - b.cardOrder);

// get ids of ordered cards related to block
    orderedCards.forEach(function (item, i, arr) {
        cardIds.push(arr[i].card);
    });

// all cards related to block
    let result = cards.filter(function (item) {
        return cardIds.indexOf(item.id) > -1
    });

// all cards related to block by order
    cardIds.forEach(function(key) {
        let found = false;
        result.filter(function(i) {
            if(!found && i.id === key) {
                result1.push(i);
                found = true;
                return false;
            } else
                return true;
        })
    });

    return result1;
}


// return cards that not included in that block
export function cardsOutsideBlock(cards, blockName) {

    let cardIds = [];
    let freeCards = [];

    let orderedCards = blockName.cards.sort((a, b) => a.cardOrder - b.cardOrder);

    orderedCards.forEach(function (item, i, arr) {
        cardIds.push(arr[i].card);
    });

    let result = cards.filter(function (item) {
        return cardIds.indexOf(item.id) === -1
    });

    result.forEach(function(item, i, arr) {
        freeCards[i] = {
            label: arr[i].title,
            value: arr[i].id
        };
    });

    freeCards.unshift({ label: '', value: '' });

    return freeCards;
}


export function getCardsNames(cards, blockName) {

    let cardsArr = groupByBlocks(cards, blockName);
    let result1 = [];
    cardsArr.forEach(function(i) {
        result1.push(i.title);
    });

    return result1;
}


export function getIdsForDeleted(item) {

    if(item.delete){
        const keys = Object.keys(item.delete);

        let result1 = [];

        keys.forEach(function(key) {
            let found = false;
            item.cards.filter(function(i) {
                if(!found && i.title === key) {
                    result1.push(i.id);
                    found = true;
                    return false;
                } else
                    return true;
            })
        });

        return result1;
    }
    return false;

}

export function getActiveBlocks(data) {
    let blocks = data.map((item)=> ({
        name: item.name,
        cards: item.cards,
        order: item.blockOrder,
        id: item._id,
        active: item.active,
        description: item.description,
        date: item.date
    })).sort((a, b) => a.order - b.order)
        .filter((bn, index, self) => bn.active > 0);

    return blocks;
}

// for card page
export function getActiveBlocksWithCards(data) {
    let blocks = data.map((item) => ({
        name: item.name,
        cards: item.cards,
        order: item.blockOrder,
        id: item._id,
        active: item.active}))
        .sort((a, b) => a.order - b.order)
        .filter((bn, index, self) => bn.cards.length !== 0 && bn.active > 0);

    return blocks;
}

// for main page
export function getActiveBlocksWithFilterableCards(data, cardData) {

    let cardIds = [];
    let result1 = [];

    let blocks = data.map((item) => ({
        name: item.name,
        cards: item.cards,
        order: item.blockOrder,
        id: item._id,
        active: item.active}))
        .sort((a, b) => a.order - b.order)
        .filter((bn, index, self) => bn.cards.length !== 0 && bn.active > 0);

    let visibleCards = cardData.filter(function (item) {
        return !item.hidden
    });

    // get ids of not hidden cards
    visibleCards.forEach(function (item, i, arr) {
        cardIds.push(arr[i].id);
    });

    cardIds.forEach(function (key) {
        blocks.forEach(function (b) {
            let found = false;
            b.cards.filter(function (i) {
                if (!found && i.card === key) {
                    if (!result1.find(o => o.name === b.name)){
                        result1.push(b);
                        found = true;
                        return false;
                    }
                } else
                    return true;
            })
        });
    });

    return result1.sort((a, b) => a.order - b.order);
}

// exclude tags owned by card
export function tagsOutsideCard(allTags, cardTags) {
    let tags = [];

    let isDeletedTag = (data) => {
        if (data) { return true; }
        return false
    };

    let validTags = allTags.filter(function(el) {
        return !isDeletedTag(el.deletedBy);
    });

    validTags.forEach(function (item, i, arr) {
        tags.push(arr[i].name);
    });

    let result = tags.filter(function (item) {
        return cardTags.indexOf(item) === -1
    });

    result.unshift('');

    return result;
}