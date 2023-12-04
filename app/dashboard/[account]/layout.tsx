export default function Layout(props: {
  children: React.ReactNode;
  feedModal: React.ReactNode;
}) {
  return (
    <>
      {props.children}
      {props.feedModal}
    </>
  );
}
