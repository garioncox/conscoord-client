export const Spinner = (props: { color?: string }) => {
  return (
    <div
      className={`animate-spin self-center inline-block size-8 border-[3px] border-current border-t-transparent text-${
        props.color ?? "blue"
      }-500 rounded-full`}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
