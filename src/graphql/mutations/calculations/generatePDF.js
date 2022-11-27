import gql from 'graphql-tag';

const GENERATE_PDF = gql`
  mutation generatePDF($data: GeneratePDFInput!) {
    generatePDF(data: $data) {
      result
    }
  }
`;

export default GENERATE_PDF;
