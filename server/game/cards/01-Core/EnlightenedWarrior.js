const DrawCard = require('../../drawcard.js');

class EnlightenedWarrior extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onSelectRingWithFate: event => event.player !== this.controller 
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to place a fate on him', this.controller, this);
                this.game.applyGameAction(context, { placeFate: context.source });
            }
        });
    }
}

EnlightenedWarrior.id = 'enlightened-warrior';

module.exports = EnlightenedWarrior;
