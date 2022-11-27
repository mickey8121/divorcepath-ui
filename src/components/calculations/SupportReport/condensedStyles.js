import styled from 'styled-components';

const CondensedSupportReportStyles = styled.div`
  .alternate-row {
    background-color: #f6f6fb;
  }

  .tax-row-amount {
    width: 20%;
    text-align: right;
  }

  #chartJS {
    /* fix blurry chart issue */
    image-rendering: optimizeSpeed; /* Older versions of FF */
    image-rendering: -moz-crisp-edges; /* FF 6.0+ */
    image-rendering: -webkit-optimize-contrast; /* Webkit (non standard naming) */
    image-rendering: -o-crisp-edges; /* OS X & Windows Opera (12.02+) */
    image-rendering: crisp-edges; /* Possible future browsers. */
    -ms-interpolation-mode: nearest-neighbor; /* IE (non standard naming) */
  }

  .condensed-doughnut {
    height: 28% !important;
    width: 28% !important;
    margin: 1% !important;
    margin-top: 0% !important;
    margin-right: 0% !important;
  }

  .details-row {
    margin: 0px;
    color: #3c4858;
    border-top: 0.0625rem solid #60589f;
    padding-left: 1rem !important;
    padding-top: 0.2rem !important;
    padding-bottom: 0.2rem !important;
    padding: 1rem;
    font-size: 0.8125rem;
    white-space: nowrap;
    font-weight: 600;
    vertical-align: top;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: inherit;
  }

  .details-label {
    width: 50%;
    text-align: left;
    padding-left: 20px;
  }

  .details-amount {
    width: 50%;
    text-align: right;
  }

  .tax-row-label {
    width: 40%;
    text-align: left;
  }

  .details-row-title {
    color: #3c4858;
    width: 100%;
    border-top: 0.0625rem solid #60589f;
    padding-left: 1rem !important;
    padding-top: 0.3rem !important;
    padding-bottom: 0.3rem !important;
    padding: 1rem;
    font-size: 0.8125rem;
    white-space: nowrap;
    font-weight: 600;
    vertical-align: top;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: inherit;
    background-color: #f6f6fb;
  }

  .person-table-title {
    color: #6c7686;
    background-color: transparent !important;
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
    padding: 1rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom-width: 1px;
    vertical-align: bottom;
    border-bottom: 1px solid #eff2f7;
    border-top: 1px solid #eff2f7;
  }

  /* .table tr th {
      width: 400px !important;
    } */

  .table th,
  .table td {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
    padding: 1rem;
  }

  /* .tax-table tbody .title {
      background-color: #f6f6fb;
      padding-left:0.3rem !important;
    } */

  .tax-table tbody th {
    padding-left: 1rem !important;
  }

  .tax-table td {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
    padding-left: 0.3rem !important;
    padding-right: 0.3rem !important;
  }

  .no-underline {
    text-decoration: none !important;
  }

  .calculator-container {
    max-width: 1120px;
    padding-left: 15px;
    width: 100%;
  }

  .table-note {
    white-space: normal !important;
  }

  .td-doughnut-chart {
    width: 250px;
  }

  .td-bar-chart {
    width: 720px;
  }

  .report-layout {
    width: 257mm !important;
  }

  .reportBody {
    margin: 0px;
    margin-top: 20px;
    overflow: hidden;
    margin-right: 20px;
    width: 100%;

    table {
      max-width: 980px;
    }
  }

  .report-cover {
    ${'' /* width:1120px; */} height:1584px;
    overflow: hidden;
    font-family: Nunito;
    background-image: url('/app/img/backgrounds/report-cover-background.png');
  }

  .report-page {
    /* width:1120px; */
    overflow: hidden;
    font-family: Nunito;
    background-repeat: no-repeat;
    background-image: url('/app/img/backgrounds/report-body-background.jpg');
    background-size: 100%;
    padding-top: 60px;
  }

  .report-contents {
    /* width:1120px; */
    height: 1414px;
    padding-top: 220px;
    overflow: hidden;
    font-family: Nunito;
    background-repeat: no-repeat;
    background-image: url('/app/img/backgrounds/report-body-background.jpg');
    background-size: 100%;
  }

  .spacer-row {
    display: flex;
    justify-content: space-between;
    height: 210px;
    margin-left: 50px;
    margin-right: 50px;
  }

  .text-muted {
    color: #3c4858 !important;
  }

  p {
    color: #3c4858 !important;
    font-size: 1rem;
    padding-right: 35px !important;
  }

  body,
  .table {
    color: #3c4858;
    overflow: hidden;
  }

  .contents-header {
    max-width: 50vw;
    padding-bottom: 10px;
    position: relative;
  }

  .bg-calculator-header {
    background-color: rgba(246, 245, 249, 0.4);
    padding-left: 60px;
    margin-top: 100px;
    overflow: hidden;
  }

  .contents-item {
    background-color: transparent !important;
    padding-left: 60px;
    margin-top: 100px;
    overflow: hidden;
  }

  .support-doughnut {
    height: 20% !important;
    width: 20% !important;
    margin: 4% !important;
    margin-top: 0% !important;
    margin-right: 8% !important;
  }

  .doughnut-row {
    display: flex;
    justify-content: space-between;
    height: 210px;
    margin-left: 50px;
    margin-right: 50px;
  }

  .bar-row {
    height: 80% !important;
    width: 45% !important;
    margin: 4% !important;
    margin-top: 0% !important;
  }

  .table > thead > tr > td {
    border-top: none;
  }

  .table {
    thead {
      tr > td {
        border-top: none;
      }

      th {
        padding-left: 40px;
        color: #6c7686;
        background-color: transparent !important;
      }
    }

    tbody {
      tr {
        td {
          padding-left: 40px !important;
          border-top: 0.0625rem solid #60589f;
        }

        th {
          border-top: 0.0625rem solid #60589f;

          &.table-middle {
            background-color: #ecedf5;
          }
        }
      }
    }

    &.children-table {
      tbody {
        tr {
          td {
            padding-left: 10px !important;

            &:nth-child(2) {
              padding-left: 20px !important;
            }

            &:nth-child(3) {
              padding-right: 48px !important;
            }

            &:nth-child(4) {
              padding-left: 30px !important;
            }
          }
        }
      }
    }
  }

  .table-striped > tbody > tr:nth-child(odd) > td,
  .table-striped > tbody > tr:nth-child(odd) > th {
    background-color: #f6f6fb;
  }

  .table-striped > tbody > tr:nth-child(odd) > td.table-middle,
  .table-striped > tbody > tr:nth-child(odd) > th.table-middle {
    background-color: #e3e5f1;
  }

  .table-striped > tbody > tr:nth-child(even) > td.table-middle,
  .table-striped > tbody > tr:nth-child(even) > th.table-middle {
    background-color: #ecedf5;
  }

  .TFtableCol {
    width: 100%;
  }
  .TFtableCol td {
    padding: 7px;
    border: #4e95f4 1px solid;
  }
  /* improve visual readability for IE8 and below */
  .TFtableCol tr {
    background: #b8d1f3;
  }
  /*  Define the background color for all the ODD table columns  */
  .TFtableCol tr td:nth-child(odd) {
    background: #b8d1f3;
  }
  /*  Define the background color for all the EVEN table columns  */
  .TFtableCol tr td:nth-child(even) {
    background: #dae5f4;
  }

  @media print {
    @page {
      size: 210mm 297mm !important;
      margin: 2cm !important;
    }

    @page :first {
      margin-top: 12mm !important;
    }
    .no-break {
      page-break-inside: avoid;
    }
  }

  /* Smartphones (portrait) ----------- */
  @media only screen and (max-width: 766px) {
    /* Styles */
    .calculator-sidebar {
      max-width: 10%;
    }
  }

  /* Smartphones (portrait and landscape) ----------- */
  @media only screen and (min-device-width: 320px) and (max-device-width: 576px) {
    .calculator-container {
      padding: 0px;
      margin: 0px;
    }
    .calculator-body {
      padding: 15px;
      margin: 0px;
    }
  }

  .incomerow {
    border-bottom: 0.0625rem solid #e9ecef;
  }

  .support-doughnut {
    width: 25%;
    margin: 4%;
    display: inline-block;
  }

  .support-bars {
    width: 100%;
    margin: 4%;
    display: inline-block;
  }
`;

export default CondensedSupportReportStyles;
