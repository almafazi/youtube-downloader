import ConvertBox from './ConvertBox';
import ConvertBoxSkeleton from './ConvertBoxSkeleton';

interface Props {
  data: any;
  isLoading: boolean;
  chooseFormat: (data: any) => void;
}
export default function PreviewBox(props: Props) {
  const { isLoading, data, chooseFormat } = props;
  if (isLoading) {
    return <ConvertBoxSkeleton />;
  }
  if (!data) {
    return <></>;
  }
  return <ConvertBox data={data} chooseFormat={chooseFormat} />;
}
