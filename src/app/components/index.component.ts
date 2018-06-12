import {Component} from '@angular/core';
import {OperatorService} from '../services/operator.service';
import {OperatorDef} from '../classes/operator';
import {Router} from '@angular/router';
import * as initialDef from '../initial-def.json';
import {compareOperatorDefs} from '../utils';


@Component({
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {

  public workingDir = '';
  public newOperatorName = '';

  constructor(private router: Router, public operators: OperatorService) {
    this.workingDir = operators.getWorkingDir();
  }

  public async refreshOperators() {
    this.operators.setWorkingDir(this.workingDir);
    await this.operators.refresh();
  }

  public async newOperator() {
    const newOperator = new OperatorDef({
      name: this.newOperatorName,
      def: JSON.parse(JSON.stringify(initialDef['default'])),
      type: 'local',
      saved: false
    });
    this.operators.addLocal(newOperator);
    await this.openOperator(newOperator);

    this.newOperatorName = '';
  }

  public async openOperator(operator: OperatorDef) {
    await this.router.navigate(['operator', operator.getName()]);
  }

  public getLocals(): Array<OperatorDef> {
    return Array
      .from(this.operators.getLocals().values())
      .sort(compareOperatorDefs);
  }

  public getElementaries(): Array<OperatorDef> {
    return Array
      .from(this.operators.getElementaries().values())
      .sort(compareOperatorDefs);
  }

  public getLibraries(): Array<OperatorDef> {
    return Array
      .from(this.operators.getLibraries().values())
      .sort(compareOperatorDefs);
  }

}
