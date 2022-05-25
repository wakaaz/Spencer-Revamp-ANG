import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions, Chart } from 'chart.js';
import { SingleDataSet, Label, Color } from 'ng2-charts';
import * as echarts from 'echarts';
import { Loader, LoaderOptions } from 'google-maps';
import { ActivatedRoute } from '@angular/router';
import { RetailerService } from '../../services/retailer.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-retailer-profile',
  templateUrl: './retailer-profile.component.html',
  styleUrls: ['./retailer-profile.component.css'],
})
export class RetailerProfileComponent implements OnInit {
  options: LoaderOptions = {
    /* todo */
  };
  loader = new Loader('AIzaSyAPx6ZyRZ1B8SoBCDMZ89LQ5TyQTr-pgN8', this.options);
  dtOptions: DataTables.Settings = {};
  dtOptionsOrders: DataTables.Settings = {};
  openReport: boolean;
  profileId: string;
  visits = [];
  orders = [];
  retailer = null;
  loading = false;
  loadingOrders = false;
  orderDetail = null;
  visitIamge = null;
  mapURL = null;
  // Payment Chart
  public paymentChartOptions: ChartOptions = {
    rotation: 1 * Math.PI,
    circumference: 1 * Math.PI,
  };
  public paymentChartLabels: Label[] = ['Cash', 'Cheque', 'Deposite'];
  public paymentChartData: SingleDataSet = [350, 209, 55]; // Static for now
  public paymentChartType: ChartType = 'doughnut';
  public paymentChartColors: Color[] = [
    {
      backgroundColor: ['#0038ba', '#282828', '#939393'],
      borderColor: ['#fff', '#fff', '#fff'],
      borderWidth: 1,
    },
  ];
  public paymentChartLegend = true;
  public paymentChartPlugins = [];

  // Invoice Chart
  public invoiceChartOptions: ChartOptions = {
    legend: {
      display: false,
    },
    legendCallback: (chart) => {
      const text = [];
      text.push('<ul class="0-legend">');
      const ds = chart.data.datasets[0];
      const sum = (ds.data as Array<number>).reduce(function add(
        a: number,
        b: number
      ): number {
        return a + b;
      },
      0);
      for (let i = 0; i < ds.data.length; i++) {
        text.push('<li>');
        const perc = Math.round((100 * (ds.data as Array<number>)[i]) / sum);
        text.push(
          '<span style="background-color:' +
            ds.backgroundColor[i] +
            '">' +
            '</span>' +
            chart.data.labels[i] +
            ' (' +
            ds.data[i] +
            ') (' +
            perc +
            '%)'
        );
        text.push('</li>');
      }
      text.push('</ul>');
      return text.join('');
    },
  };
  public invoiceChartData: SingleDataSet = [400, 300]; // Static for now
  public invoiceChartType: ChartType = 'pie';
  public InvoiceChartLabels: Label[] = ['Paid Invoices', 'Pending Invoices'];
  public invoiceChartColors: string[] = ['#0038ba', '#282828'];

  // Category Chart
  public categoryChartType: ChartType = 'pie';
  public categoryChartLabels: Label[] = [
    'Shahi Meva',
    'Aas Pas',
    'Daal Channa',
    'Daal Moong',
    'Ballay Nimko',
    'Shahi Elaichi',
  ]; // Static for now
  public categoryChartData: SingleDataSet = [800, 700, 600, 950, 500, 150]; // Static for now
  public categoryChartColors: Color[] = [
    {
      backgroundColor: [
        '#002b8f',
        '#0038ba',
        '#1052eb',
        '#282828',
        '#7a7a7a',
        '#b4b4b4',
      ],
      borderWidth: 1,
    },
  ];
  public categoryChartOptions: ChartOptions = {
    // scales: {
    //     yAxes: [{ ticks: { beginAtZero: true }}],
    //     xAxes: [{ ticks: { display: false }}]
    // },
    legend: { position: 'right' },
  };

  constructor(
    private route: ActivatedRoute,
    private retailerService: RetailerService,
    private toastService: ToasterService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.profileId = this.route.snapshot.paramMap.get('id');
    this.retailer = JSON.parse(this.route.snapshot.queryParams.retailer);
    // this.mapURL = this.sanitizer.bypassSecurityTrustUrl
    // (`https://maps.google.com/?q="${this.retailer?.retailer_lats},${this.retailer?.retailer_longs}`);
    this.loader.load().then(function (google) {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    });
    this.dtOptions = {
      pagingType: 'simple_numbers',
    };
    this.retailerService.getRetailerVisitsById(this.profileId).subscribe(
      (data) => {
        this.visits = data;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        if (error.status !== 401 && error.status !== 1) {
          this.toastService.showToaster({
            title: 'Error:',
            message: 'Visits not fetched, try again later.',
            type: 'error',
          });
        }
        scrollTo(0, 0);
      }
    );
  }

  getRetailerOrders(): void {
    this.loadingOrders = true;
    this.dtOptionsOrders = {
      pagingType: 'simple_numbers',
    };
    this.retailerService.getRetailerOrdersById(this.profileId).subscribe(
      (data) => {
        this.orders = data;
        this.loadingOrders = false;
      },
      (error) => {
        this.loadingOrders = false;
        if (error.status !== 401 && error.status !== 1) {
          this.toastService.showToaster({
            title: 'Error:',
            message: 'Orders not fetched, try again later.',
            type: 'error',
          });
        }
        scrollTo(0, 0);
      }
    );
  }
  openSalesAndProductsReport(event: Event): void {
    event.stopPropagation();
    this.openReport = true;
    document.body.classList.add('no-scroll');
    document
      .getElementsByClassName('overlay-blure')[0]
      .classList.add('d-block');
    document.getElementById('profile').classList.add('blur-div');
    this.createInvoiceCharts();
    this.createProductWiseChart();
  }

  createInvoiceCharts(): void {
    const ctx: any = document.getElementById('invoicechart');
    const chart = new Chart(ctx, {
      type: this.invoiceChartType,
      data: {
        labels: this.InvoiceChartLabels,
        datasets: [
          {
            backgroundColor: this.invoiceChartColors,
            data: this.invoiceChartData,
          },
        ],
      },
      options: this.invoiceChartOptions,
    });
    const legend = document.getElementById('legend');
    (legend.innerHTML as any) = chart.generateLegend();
    const legendItems = legend.getElementsByTagName('li');

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < legendItems.length; i += 1) {
      legendItems[i].addEventListener(
        'click',
        this.invoiceLegendClicked,
        false
      );
    }
  }

  createProductWiseChart(): void {
    const eChartElem = document.getElementById('e_chart_1');
    const eChart = echarts.init(eChartElem);
    const app: any = {};
    let option = null;
    const posList = [
      'left',
      'right',
      'top',
      'bottom',
      'inside',
      'insideTop',
      'insideLeft',
      'insideRight',
      'insideBottom',
      'insideTopLeft',
      'insideTopRight',
      'insideBottomLeft',
      'insideBottomRight',
    ];
    app.configParameters = {
      rotate: {
        min: -90,
        max: 90,
      },
      align: {
        options: {
          left: 'left',
          center: 'center',
          right: 'right',
        },
      },
      verticalAlign: {
        options: {
          top: 'top',
          middle: 'middle',
          bottom: 'bottom',
        },
      },
      position: {
        options: echarts.util.reduce(
          posList,
          (map, pos) => {
            map[pos] = pos;
            return map;
          },
          {}
        ),
      },
      distance: {
        min: 0,
        max: 100,
      },
    };

    app.config = {
      rotate: 90,
      align: 'left',
      verticalAlign: 'middle',
      position: 'insideBottom',
      distance: 15,
      onChange: () => {
        const labels = {
          normal: {
            rotate: app.config.rotate,
            align: app.config.align,
            verticalAlign: app.config.verticalAlign,
            position: app.config.position,
            distance: app.config.distance,
          },
        };
        eChart.setOption({
          series: [
            {
              label: labels,
            },
            {
              label: labels,
            },
            {
              label: labels,
            },
            {
              label: labels,
            },
          ],
        });
      },
    };
    const labelOption = {
      normal: {
        show: true,
        position: app.config.position,
        distance: app.config.distance,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        rotate: app.config.rotate,
        formatter: '{c}',
        fontSize: 10,
        rich: {
          name: {
            textBorderColor: '#fff',
          },
        },
      },
    };
    option = {
      color: ['#0038ba', '#282828'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(33,33,33,1)',
        borderRadius: 0,
        padding: 5,
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: 'rgba(33,33,33,1)',
          },
        },
        textStyle: {
          color: '#fff',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontFamily: '"Roboto", sans-serif',
          fontSize: 12,
        },
      },
      legend: {
        data: ['Product'],
      },
      toolbox: {
        show: false,
        orient: 'vertical',
        left: 'right',
        padding: 0,
        margin: 0,
        top: 'center',
        feature: {
          mark: {
            show: true,
          },
          dataView: {
            show: true,
            readOnly: true,
          },
          magicType: {
            show: true,
            type: ['line', 'bar', 'stack', 'tiled'],
          },
          restore: {
            show: true,
          },
          saveAsImage: {
            show: false,
          },
        },
      },
      grid: {
        left: '0',
        right: '0',
        top: '35px',
        bottom: '0',
        containLabel: true,
      },
      calculable: true,
      type: 'value',
      axisLine: {
        show: true,
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            show: true,
          },
          data: [
            'Name 1',
            'Name 2',
            'Name 3',
            'Name 4',
            'Name 5',
            'Name 6',
            'Name 7',
            'Name 8',
            'Name 9',
            'Name 10',
          ],
          axisLine: {
            show: true,
          },
          axisLabel: {
            textStyle: {
              color: '#a0a0a0',
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: true,
          },
          axisLabel: {
            textStyle: {
              color: '#a0a0a0',
            },
          },
          splitLine: {
            show: true,
          },
        },
      ],
      series: [
        {
          name: 'Sales',
          type: 'bar',
          barGap: 0,
          label: labelOption,
          data: [600, 510, 480, 420, 390, 330, 300, 280, 265, 205],
        },
        {
          name: 'percentage',
          type: 'line',
          label: labelOption,
          data: [600, 510, 480, 420, 390, 330, 300, 280, 265, 205],
        },
      ],
    };
    if (option && typeof option === 'object') {
      eChart.setOption(option, true);
    }
  }

  invoiceLegendClicked(event): void {
    event = event || window.event;

    let target = event.target || event.srcElement;
    while (target.nodeName !== 'LI') {
      target = target.parentElement;
    }
    const parent = target.parentElement;
    let chart = null;
    for (const ch in Chart.instances) {
      if (Chart.instances[ch].canvas.id === 'PaymentMode') {
        chart = Chart.instances[ch];
      }
    }
    const index = Array.prototype.slice.call(parent.children).indexOf(target);
    const meta = chart.getDatasetMeta(0);
    const item = meta.data[index];

    if (item.hidden === null || item.hidden === false) {
      item.hidden = true;
      target.classList.add('hidden');
    } else {
      target.classList.remove('hidden');
      item.hidden = null;
    }
    chart.update();
  }

  clickedOutSide(event: Event): void {
    if (
      this.openReport &&
      !(event.target as HTMLElement).classList.contains('paginate_button')
    ) {
      this.closeSalesAndProductsReport();
    }
  }

  closeSalesAndProductsReport(): void {
    this.openReport = false;
    document.body.classList.remove('no-scroll');
    document
      .getElementsByClassName('overlay-blure')[0]
      .classList.remove('d-block');
    document.getElementById('profile').classList.remove('blur-div');
  }

  getOrderDetail(
    orderId: string,
    orderBooker: string,
    salesman: string,
    date: string,
    invoice_number: string,
    status: string
  ): void {
    this.orderDetail = null;
    this.retailerService.getOrderDetail(orderId).subscribe((res) => {
      const data = {
        items: res.details,
        order_booker: orderBooker,
        salesman: salesman,
        date: date,
        invoice_number,
        status,
      };
      this.orderDetail = { ...data };
    });
  }

  showVisitStorePicture(id) {
    const visit = this.visits.find((x) => x.id === id);
    this.visitIamge = visit.picture;
  }
  getGrAmount(items: any) {
    return items
      ?.map((x) => x.final_price)
      .reduce((accumulator, cur) => accumulator + cur);
  }
  getToAmount(items: any) {
    return items
      ?.map((x) => x.trade_offer)
      .reduce((accumulator, cur) => accumulator + cur);
  }
  getSpcDiscAmount(items: any) {
    return items
      ?.map((x) => x.special_discount)
      .reduce((accumulator, cur) => accumulator + cur);
  }
  getExtraDiscAmount(items: any) {
    return items
      ?.map((x) => x.extra_discount)
      .reduce((accumulator, cur) => accumulator + cur);
  }
}
