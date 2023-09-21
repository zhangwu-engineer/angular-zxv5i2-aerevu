import { Component, OnInit,ViewChild,AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { FormGroup, FormControl } from '@angular/forms';
import {throttleTime} from 'rxjs/operators'
import {CustomPaginatorComponent} from './custom-paginator/custom-paginator.component'
export interface PeriodicElement {
  name: string;
  position: number;
  electronegative: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name:"Actinium",symbol:"Ac",position:89,electronegative:1.1},
{name:"Aluminum",symbol:"Al",position:13,electronegative:1.61},
{name:"Americium",symbol:"Am",position:95,electronegative:1.3},
{name:"Antimony",symbol:"Sb",position:51,electronegative:2.05},
{name:"Argon",symbol:"Ar",position:18,electronegative:0},
{name:"Arsenic",symbol:"As",position:33,electronegative:2.18},
{name:"Astatine",symbol:"At",position:85,electronegative:2.2},
{name:"Barium",symbol:"Ba",position:56,electronegative:0.89},
{name:"Berkelium",symbol:"Bk",position:97,electronegative:1.3},
{name:"Beryllium",symbol:"Be",position:4,electronegative:1.57},
{name:"Bismuth",symbol:"Bi",position:83,electronegative:2.02},
{name:"Bohrium",symbol:"Bh",position:107,electronegative:0},
{name:"Boron",symbol:"B",position:5,electronegative:2.04},
{name:"Bromine",symbol:"Br",position:35,electronegative:2.96},
{name:"Cadmium",symbol:"Cd",position:48,electronegative:1.69},
{name:"Calcium",symbol:"Ca",position:20,electronegative:1},
{name:"Californium",symbol:"Cf",position:98,electronegative:1.3},
{name:"Carbon",symbol:"C",position:6,electronegative:2.55},
{name:"Cerium",symbol:"Ce",position:58,electronegative:1.12},
{name:"Cesium",symbol:"Cs",position:55,electronegative:0.79},
{name:"Chlorine",symbol:"Cl",position:17,electronegative:3.16},
{name:"Chromium",symbol:"Cr",position:24,electronegative:1.66},
{name:"Cobalt",symbol:"Co",position:27,electronegative:1.88},
{name:"Copper",symbol:"Cu",position:29,electronegative:1.9},
{name:"Curium",symbol:"Cm",position:96,electronegative:1.3},
{name:"Darmstadtium",symbol:"Ds",position:110,electronegative:0},
{name:"Dubnium",symbol:"Db",position:105,electronegative:0},
{name:"Dysprosium",symbol:"Dy",position:66,electronegative:1.22},
{name:"Einsteinium",symbol:"Es",position:99,electronegative:1.3},
{name:"Erbium",symbol:"Er",position:68,electronegative:1.24},
{name:"Europium",symbol:"Eu",position:63,electronegative:0},
{name:"Fermium",symbol:"Fm",position:100,electronegative:1.3},
{name:"Fluorine",symbol:"F",position:9,electronegative:3.98},
{name:"Francium",symbol:"Fr",position:87,electronegative:0.7},
{name:"Gadolinium",symbol:"Gd",position:64,electronegative:1.2},
{name:"Gallium",symbol:"Ga",position:31,electronegative:1.81},
{name:"Germanium",symbol:"Ge",position:32,electronegative:2.01},
{name:"Gold",symbol:"Au",position:79,electronegative:2.54},
{name:"Hafnium",symbol:"Hf",position:72,electronegative:1.3},
{name:"Hassium",symbol:"Hs",position:108,electronegative:0},
{name:"Helium",symbol:"He",position:2,electronegative:0},
{name:"Holmium",symbol:"Ho",position:67,electronegative:1.23},
{name:"Hydrogen",symbol:"H",position:1,electronegative:2.2},
{name:"Indium",symbol:"In",position:49,electronegative:1.78},
{name:"Iodine",symbol:"I",position:53,electronegative:2.66},
{name:"Iridium",symbol:"Ir",position:77,electronegative:2.2},
{name:"Iron",symbol:"Fe",position:26,electronegative:1.83},
{name:"Krypton",symbol:"Kr",position:36,electronegative:3},
{name:"Lanthanum",symbol:"La",position:57,electronegative:1.1},
{name:"Lawrencium",symbol:"Lr",position:103,electronegative:0},
{name:"Lead",symbol:"Pb",position:82,electronegative:2.33},
{name:"Lithium",symbol:"Li",position:3,electronegative:0.98},
{name:"Lutetium",symbol:"Lu",position:71,electronegative:1.27},
{name:"Magnesium",symbol:"Mg",position:12,electronegative:1.31},
{name:"Manganese",symbol:"Mn",position:25,electronegative:1.55},
{name:"Meitnerium",symbol:"Mt",position:109,electronegative:0},
{name:"Mendelevium",symbol:"Md",position:101,electronegative:1.3},
{name:"Mercury",symbol:"Hg",position:80,electronegative:2},
{name:"Molybdenum",symbol:"Mo",position:42,electronegative:2.16},
{name:"Neodymium",symbol:"Nd",position:60,electronegative:1.14},
{name:"Neon",symbol:"Ne",position:10,electronegative:0},
{name:"Neptunium",symbol:"Np",position:93,electronegative:1.36},
{name:"Nickel",symbol:"Ni",position:28,electronegative:1.91},
{name:"Niobium",symbol:"Nb",position:41,electronegative:1.6},
{name:"Nitrogen",symbol:"N",position:7,electronegative:3.04},
{name:"Nobelium",symbol:"No",position:102,electronegative:1.3},
{name:"Oganesson",symbol:"Uuo",position:118,electronegative:0},
{name:"Osmium",symbol:"Os",position:76,electronegative:2.2},
{name:"Oxygen",symbol:"O",position:8,electronegative:3.44},
{name:"Palladium",symbol:"Pd",position:46,electronegative:2.2},
{name:"Phosphorus",symbol:"P",position:15,electronegative:2.19},
{name:"Platinum",symbol:"Pt",position:78,electronegative:2.28},
{name:"Plutonium",symbol:"Pu",position:94,electronegative:1.28},
{name:"Polonium",symbol:"Po",position:84,electronegative:2},
{name:"Potassium",symbol:"K",position:19,electronegative:0.82},
{name:"Praseodymium",symbol:"Pr",position:59,electronegative:1.13},
{name:"Promethium",symbol:"Pm",position:61,electronegative:0},
{name:"Protactinium",symbol:"Pa",position:91,electronegative:1.5},
{name:"Radium",symbol:"Ra",position:88,electronegative:0.9},
{name:"Radon",symbol:"Rn",position:86,electronegative:0},
{name:"Rhenium",symbol:"Re",position:75,electronegative:1.9},
{name:"Rhodium",symbol:"Rh",position:45,electronegative:2.28},
{name:"Roentgenium",symbol:"Rg",position:111,electronegative:0},
{name:"Rubidium",symbol:"Rb",position:37,electronegative:0.82},
{name:"Ruthenium",symbol:"Ru",position:44,electronegative:2.2},
{name:"Rutherfordium",symbol:"Rf",position:104,electronegative:0},
{name:"Samarium",symbol:"Sm",position:62,electronegative:1.17},
{name:"Scandium",symbol:"Sc",position:21,electronegative:1.36},
{name:"Seaborgium",symbol:"Sg",position:106,electronegative:0},
{name:"Selenium",symbol:"Se",position:34,electronegative:2.55},
{name:"Silicon",symbol:"Si",position:14,electronegative:1.9},
{name:"Silver",symbol:"Ag",position:47,electronegative:1.93},
{name:"Sodium",symbol:"Na",position:11,electronegative:0.93},
{name:"Strontium",symbol:"Sr",position:38,electronegative:0.95},
{name:"Sulfur",symbol:"S",position:16,electronegative:2.58},
{name:"Tantalum",symbol:"Ta",position:73,electronegative:1.5},
{name:"Technetium",symbol:"Tc",position:43,electronegative:1.9},
{name:"Tellurium",symbol:"Te",position:52,electronegative:2.1},
{name:"Terbium",symbol:"Tb",position:65,electronegative:0},
{name:"Thallium",symbol:"Tl",position:81,electronegative:1.62},
{name:"Thorium",symbol:"Th",position:90,electronegative:1.3},
{name:"Thulium",symbol:"Tm",position:69,electronegative:1.25},
{name:"Tin",symbol:"Sn",position:50,electronegative:1.96},
{name:"Titanium",symbol:"Ti",position:22,electronegative:1.54},
{name:"Tungsten",symbol:"W",position:74,electronegative:2.36},
{name:"Ununbium",symbol:"Uub",position:112,electronegative:0},
{name:"Ununhexium",symbol:"Uuh",position:116,electronegative:0},
{name:"Ununpentium",symbol:"Uup",position:115,electronegative:0},
{name:"Ununquadium",symbol:"Uuq",position:114,electronegative:0},
{name:"Ununseptium",symbol:"Uus",position:117,electronegative:0},
{name:"Ununtrium",symbol:"Uut",position:113,electronegative:0},
{name:"Uranium",symbol:"U",position:92,electronegative:1.38},
{name:"Vanadium",symbol:"V",position:23,electronegative:1.63},
{name:"Xenon",symbol:"Xe",position:54,electronegative:2.6},
{name:"Ytterbium",symbol:"Yb",position:70,electronegative:0},
{name:"Yttrium",symbol:"Y",position:39,electronegative:1.22},
{name:"Zinc",symbol:"Zn",position:30,electronegative:1.65},
{name:"Zirconium",symbol:"Zr",position:40,electronegative:1.33},
{name:"1-Zirconium",symbol:"Zr",position:40,electronegative:1.33},
{name:"2-Zirconium",symbol:"Zr",position:40,electronegative:1.33},

];

/**
 * @title Table with filtering
 */
@Component({
  selector: 'table-filtering-example',
  styleUrls: ['table-filtering-example.css'],
  templateUrl: 'table-filtering-example.html'
})
export class TableFilteringExample implements OnInit,AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'electronegative', 'symbol'];
  dataSource:MatTableDataSource<any>
  @ViewChild(CustomPaginatorComponent,{static:true}) paginator:CustomPaginatorComponent
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit() {
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    if (this.paginator)
    {
    this.paginator.pageSize=10
    this.dataSource.paginator=this.paginator
    }
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

/**  Copyright 2021 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
