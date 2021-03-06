const _ = require('underscore');

const CardAbility = require('./CardAbility.js');
const Costs = require('./costs.js');
const TriggeredAbilityContext = require('./TriggeredAbilityContext.js');

class TriggeredAbility extends CardAbility {
    constructor(game, card, abilityType, properties) {
        super(game, card, properties);

        this.when = properties.when;
        this.abilityType = abilityType;
        this.abilityIdentifier = this.printedAbility ? this.card.id + this.card.abilities.reactions.length.toString() : '';
        this.maxIdentifier = this.card.name + this.abilityIdentifier;

        if(this.max) {
            this.card.owner.registerAbilityMax(this.maxIdentifier, this.max);
            this.cost.push(Costs.playMax());
        }
    }

    eventHandler(event, window) {
        let context = this.createContext(event);

        if(this.isTriggeredByEvent(event, context) && this.meetsRequirements(context)) {
            window.addChoice(context);
        }
    }

    createContext(event) {
        return new TriggeredAbilityContext({ event: event, game: this.game, source: this.card, player: this.card.controller, ability: this });
    }

    isTriggeredByEvent(event, context) {
        let listener = this.when[event.name];

        return listener && listener(event, context);
    }

    meetsRequirements(context) {
        if(!super.meetsRequirements()) {
            return false;
        }

        if(!this.isTriggeredByEvent(context.event, context)) {
            return false;
        }
        return this.canResolveTargets(context);
    }

    isAction() {
        return false;
    }

    isForcedAbility() {
        return false;
    }

    registerEvents() {
        if(this.events) {
            return;
        }

        var eventNames = _.keys(this.when);

        this.events = [];
        _.each(eventNames, eventName => {
            var event = {
                name: eventName + ':' + this.abilityType,
                handler: (event, window) => this.eventHandler(event, window)
            };
            this.game.on(event.name, event.handler);
            this.events.push(event);
        });
    }

    unregisterEvents() {
        if(this.events) {
            _.each(this.events, event => {
                this.game.removeListener(event.name, event.handler);
            });
            this.events = null;
        }
    }
}

module.exports = TriggeredAbility;
