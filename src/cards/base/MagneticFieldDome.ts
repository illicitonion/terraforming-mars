import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MagneticFieldDome implements IProjectCard {
    public cost = 5;
    public tags = [Tags.BUILDING];
    public cardType = CardType.AUTOMATED;
    public name = CardName.MAGNETIC_FIELD_DOME;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
      const hasEnergyProduction = player.getProduction(Resources.ENERGY) >= 2;
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, true) && hasEnergyProduction;
      }

      return hasEnergyProduction;
    }

    public play(player: Player, game: Game) {
      player.addProduction(Resources.ENERGY, -2);
      player.addProduction(Resources.PLANTS);
      player.increaseTerraformRating(game);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: '171',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.minus().energy(2).br;
          pb.plus().plants(1);
        });
        b.tr(1);
      }),
      description: 'Decrease your Energy production 2 steps and increase your Plant production 1 step. Raise your TR 1 step.',
    };
}
