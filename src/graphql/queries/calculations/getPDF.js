import gql from 'graphql-tag';

const GET_PDF = gql`
  query getPDF($data: GetPDFInput!) {
    getPDF(data: $data) {
      pdfUrl
    }
  }
`;

export default GET_PDF;
