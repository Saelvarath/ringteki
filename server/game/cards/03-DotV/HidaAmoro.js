const DrawCard = require('../../drawcard.js');

class HidaAmoro extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.forcedReaction({
            title: 'Sacrifice a character',
            when: { onConflictPass: event => event.conflict.attackingPlayer.cardsInPlay.any(card => card.allowGameAction('sacrifice'))
            },
            limit: ability.limit.perPhase(Infinity),
            handler: context => {
                const triggeringPlayer = context.event.conflict.attackingPlayer;
                this.game.promptForSelect(triggeringPlayer, {
                    activePromptTitle: 'Choose a character to sacrifice',
                    source: this,
                    gameAction: 'sacrifice',
                    cardType: 'character',
                    cardCondition: card => card.location === 'play area' && card.controller === triggeringPlayer,
                    onSelect: (player, card) => {
                        this.game.addMessage('{0} triggers {1}, they choose to sacrifice {3}', triggeringPlayer, this, card);
                        this.game.applyGameAction(context, { sacrifice: card });
                        return true;
                    }
                });
            }
        });
    }
}

HidaAmoro.id = 'hida-amoro'; // This is a guess at what the id might be - please check it!!!

module.exports = HidaAmoro;
