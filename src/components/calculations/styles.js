import styled from 'styled-components';

const SupportReportStyles = styled.div`
  .details-row {
    margin: 0px;
    color: #3c4858;
    border-top: 0.0625rem solid #60589f;
    padding-left: 1rem !important;
    padding-top: 0.2rem !important;
    padding-bottom: 0.2rem !important;
    padding: 1rem;
    font-size: 0.8125rem;
    white-space: initial;
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

  #chartJS {
    /* fix blurry chart issue */
    image-rendering: optimizeSpeed; /* Older versions of FF */
    image-rendering: -moz-crisp-edges; /* FF 6.0+ */
    image-rendering: -webkit-optimize-contrast; /* Webkit (non standard naming) */
    image-rendering: -o-crisp-edges; /* OS X & Windows Opera (12.02+) */
    image-rendering: crisp-edges; /* Possible future browsers. */
    -ms-interpolation-mode: nearest-neighbor; /* IE (non standard naming) */
  }

  .no-underline {
    text-decoration: none !important;
  }

  .calculator-container {
    max-width: 1120px;
    padding-left: 15px;
    width: 100%;
  }

  .tax-table tbody .title {
    background-color: #f6f6fb;
    padding-left: 0.3rem !important;
  }

  .tax-table tbody th {
    padding-left: 1rem !important;
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
    padding-right: 0.3rem !important;
  }

  .tax-table td {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
    padding-left: 0.3rem !important;
    padding-right: 0.3rem !important;
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
    /* overflow:hidden;
      width:1120px; */
    overflow: hidden;
    width: 1000px;
    margin: 0cm !important;
  }

  .reportBody {
    overflow: hidden;
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
  }

  body,
  .table {
    color: #3c4858;
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

  .table > tbody > tr > td {
    padding-left: 35px;
    border-top: 0.0625rem solid #60589f;
  }

  .table > tbody > tr > th {
    border-top: 0.0625rem solid #60589f;
    color: #000;
    white-space: nowrap;
    font-size: 14px;
    padding-right: 0.5rem;
    max-width: 200px;
  }

  .table thead th {
    padding-left: 40px;
    color: #6c7686;
    background-color: transparent !important;
  }

  th.table-middle {
    background-color: #ecedf5;
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

  /* Smartphones (portrait) ----------- */
  @media only screen and (max-width: 766px) {
    /* Styles */
    .calculator-sidebar {
      max-width: 10%;
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

  .nav-tabs .nav-link.active {
    color: var(--dark);
  }

  .nav-tabs .nav-link {
    color: var(--gray-light);
  }

  .btn-group-toggle {
    padding: 0px;
  }

  .list-group {
    list-style: none;
  }

  .avatar-lg {
    font-size: 3em;
  }

  .flame {
    background-color: #ff9a1f;
  }

  .clearButton {
    -webkit-appearance: none !important;
  }

  .nav.nav-tabs {
    margin-bottom: 20px;
  }

  .LoggedInWith {
    padding: 20px;
    border-radius: 3px;
    color: #fff;
    border: 1px solid var(--gray-lighter);
    text-align: center;
    img {
      width: 100px;
    }

    &.github img {
      width: 125px;
    }

    p {
      margin: 20px 0 0 0;
      color: var(--gray-light);
    }

    .btn {
      margin-top: 20px;
      &.btn-facebook {
        background: var(--facebook);
        border-color: var(--facebook);
        color: #fff;
      }

      &.btn-google {
        background: var(--google);
        border-color: var(--google);
        color: #fff;
      }

      &.btn-github {
        background: var(--github);
        border-color: var(--github);
        color: #fff;
      }
    }
  }

  .btn-export {
    padding: 0;
  }

  .feature-cover {
    background-image: url('/app/img/backgrounds/bg-park.webp');
    background-position: 30% bottom;
  }
`;

export default SupportReportStyles;
