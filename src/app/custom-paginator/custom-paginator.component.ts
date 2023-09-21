import {
  Component,
  Optional,
  Inject,
  ChangeDetectorRef,
  OnInit,
  Input,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  MatPaginatorDefaultOptions,
  MAT_PAGINATOR_DEFAULT_OPTIONS,
  MatPaginatorIntl,
  _MatPaginatorBase,
} from '@angular/material/paginator';

import { FormControl } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import {
  map,
  startWith,
  takeUntil,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';

export function AutoUnsubscribe(constructor: any) {
  const original = constructor.prototype.ngOnDestroy;

  constructor.prototype.ngOnDestroy = function () {
    this.active.next();
    this.active.complete();
    original &&
      typeof original === 'function' &&
      original.apply(this, arguments);
  };
}

@Component({
  selector: 'custom-paginator',
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@AutoUnsubscribe
export class CustomPaginatorComponent
  extends _MatPaginatorBase<MatPaginatorDefaultOptions>
  implements OnInit, AfterViewInit
{
  @Input() countPage: number = 0;
  @Input() nextLabel: string;
  @Input() previousLabel: string;
  @Input('justify-content') set _(value: any) {
    this.justify = value;
  }

  countPages: number;
  control = new FormControl(0);
  justify: any = null;

  active: Subject<any> = new Subject<any>();

  _buttons: string[];
  pageIndexOld: number;
  countPagesOld: number;
  pageSizeOld: number;
  lengthOld: number;

  get buttons() {
    if (
      !this._buttons ||
      this.pageIndexOld != this.pageIndex ||
      this.countPagesOld != this.countPages ||
      this.pageSizeOld != this.pageSize ||
      this.lengthOld != this.length
    ) {
      this._buttons = this.createButtonsPage();
      this.pageIndexOld = this.pageIndex;
      this.countPagesOld = this.countPages;
      this.pageSizeOld = this.pageSize;
      const last = this.getNumberOfPages();
      if (last && +this.control.value > last)
        this.control.setValue(last, { emitEvent: false });
    }
    return this._buttons;
  }

  constructor(
    intl: MatPaginatorIntl,
    private changeDetectorRef: ChangeDetectorRef,
    @Optional()
    @Inject(MAT_PAGINATOR_DEFAULT_OPTIONS)
    defaults?: MatPaginatorDefaultOptions
  ) {
    super(intl, changeDetectorRef, defaults);
  }

  ngAfterViewInit() {
    this.emitPageEvent(0);
    this.control.setValue(1);
    fromEvent(window, 'resize')
      .pipe(
        startWith({ target: { innerWidth: window.innerWidth } }),
        debounceTime(200),
        distinctUntilChanged(),
        takeUntil(this.active),
        map((e: any) => {
          const countPage =
            e.target.innerWidth > 620 ? (e.target.innerWidth > 750 ? 9 : 7) : 5;
          return this.countPage
            ? countPage < this.countPage
              ? countPage
              : this.countPage
            : countPage;
        })
      )
      .subscribe((x: number) => {
        this.countPages = this.countPagesOld = x;
        this._buttons = this.createButtonsPage();
        this.changeDetectorRef.markForCheck();
      });

    this.control.valueChanges
      .pipe(startWith(1), debounceTime(200))
      .subscribe((res) => {
        let page = +res;
        if (page > this.getNumberOfPages()) {
          page = this.getNumberOfPages() - 1;
        } else page = page - 1;
        if (page != this.pageIndex) this.emitPageEvent(page);
      });
  }
  pageSizeChange(value: number) {
    this._changePageSize(value);
    setTimeout(() => {
      this.control.setValue(this.pageIndex + 1, { emitEvent: false });
    });
  }
  emitPageEvent(previousPageIndex: any) {
    this.pageIndex = previousPageIndex;
    this.page.emit({
      previousPageIndex,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length,
    });
    this.changeDetectorRef.markForCheck();
  }
  gotoPage(page: number) {
    this.emitPageEvent(page);
    this.control.setValue(page + 1, { emitEvent: false });
  }
  createButtonsPage() {
    const last = this.getNumberOfPages() - 1;
    const b = new Array(
      last < this.countPages ? last + 1 : this.countPages
    ).fill('.');

    if (last < this.countPages) return b.map((_x, i) => '' + i);

    const links0_5 = (this.countPages - 1) / 2;
    let start = this.pageIndex - links0_5 < 0 ? 0 : this.pageIndex - links0_5;
    let end =
      start == 0
        ? this.countPages - 1
        : this.pageIndex + links0_5 > last
        ? last
        : this.pageIndex + links0_5;

    if (end == last) start = end - this.countPages + 1;

    return b.map((_x, i) => {
      return i == 0
        ? '0'
        : i == this.countPages - 1
        ? '' + last
        : (i == 1 && start) || (i == this.countPages - 2 && end != last)
        ? '...'
        : '' + (i + start);
    });
  }
}
