import styled from 'styled-components';

const DetailedSupportReportStyles = styled.div`
  .tax-row-label {
    width:40%;
    text-align:left;
  }

  .tax-row-amount {
    width:20%
    text-align:right;
  }

  .report-layout {
    overflow: hidden;
    width: 1120px;
  }

  .reportBody {
    margin-left: 110px;
    margin-top: 40px;
    padding-right: 68px;
    overflow: hidden;
  }

  @media print {
    .cover {
      page-break-after: always;
      margin: 0;
      color: #000;
      background-color: #fff;
      background: url(./../../../img/backgrounds/bg-park-shade.png) no-repeat center
        fixed;
      -webkit-background-size: cover;
      -moz-background-size: cover;
      -o-background-size: cover;
      background-size: cover;
    }

    .page {
      page-break-after: always;
    }

    @page {
      size: 210mm 297mm !important;
      margin: 0mm !important;
      background-image: url(url(./../../../img/backgrounds/bg-park-shade.png) no-repeat
        center fixed;
      -webkit-background-size: cover;
      -moz-background-size: cover;
      -o-background-size: cover;
      background-size: cover;
    }
  }
`;

export default DetailedSupportReportStyles;
