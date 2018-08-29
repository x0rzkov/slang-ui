import {Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {OperatorInstance, Transformable} from '../classes/operator';
import {generateSvgTransform} from '../utils';
import {VisualService} from "../services/visual.service";

@Component({
  selector: 'app-instance,[app-instance]',
  templateUrl: './instance.component.svg.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstanceComponent implements OnInit {
  @Input()
  public aspect: string;

  public instance_: OperatorInstance;

  @Input()
  set instance(ins: OperatorInstance) {
    this.instance_ = ins;
    this.visual.registerCallback(ins, () => {
      this.ref.detectChanges();
    });
    this.ref.detectChanges();
  }

  get instance() {
    return this.instance_;
  }

  private fqn = '';

  @Output()
  public hoverPort: EventEmitter<any> = new EventEmitter();
  @Output()
  public selectPort: EventEmitter<any> = new EventEmitter();
  @Output()
  public selectInstance: EventEmitter<any> = new EventEmitter();

  public constructor(private ref: ChangeDetectorRef, public visual: VisualService) {
    ref.detach();
  }

  public getCSSClass(): any {
    const cssClass = {};
    cssClass['selected'] = this.visual.isInstanceSelected(this.instance);
    cssClass['hovered'] = this.visual.isInstanceHovered(this.instance);
    cssClass['sl-svg-op-type'] = true;
    cssClass[this.instance.getOperatorType()] = true;
    return cssClass;
  }

  public ngOnInit() {
    this.fqn = this.instance.getFullyQualifiedName();
    this.ref.detectChanges();
  }

  public transform(trans: Transformable): string {
    return generateSvgTransform(trans);
  }

  public form(): string {
    switch (this.fqn) {
      case 'slang.data.Value':
        return 'circle';
      default:
        return 'rect';
    }
  }

  public radius(): number {
    return Math.max(this.instance.getWidth(), this.instance.getHeight()) / 2;
  }

  public text(): string {
    const fqn = this.instance.getFullyQualifiedName();
    const props = this.instance.getProperties();

    switch (fqn) {
      case 'slang.data.Value':
        return !!props ? JSON.stringify(props['value']) : 'value?';
      case 'slang.data.Evaluate':
        return !!props ? props['expression'] : 'eval?';
      case 'slang.data.Convert':
        return '';
      default:
        return this.instance.lastName();
    }
  }

}
