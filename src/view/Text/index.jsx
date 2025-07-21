import escapeHtml from "../../util/html-escape";

export default function Text({ children, className, editable, ...props }) {
  if (typeof children === "string") {
    return (
      <text
        x="0"
        y="0"
        className={
          [
            'font-semibold',
            editable ? 'hover:text-orange-400 cursor-pointer' : undefined,
            className
          ].filter(v => v).join(' ').trim()
        }
        dominantBaseline="hanging"
        stroke="none"
        fill="currentColor"
        dangerouslySetInnerHTML={{ __html: escapeHtml(children) }}
        {...props}
      ></text>
    );
  }
  return (
    <text
      x="0"
      y="0"
      className={
        [
          'font-semibold',
          editable ? 'hover:text-orange-400 cursor-pointer' : undefined,
          className
        ].filter(v => v).join(' ').trim()
      }
      dominantBaseline="hanging"
      stroke="none"
      fill="currentColor"
      {...props}
    >
      {children}
    </text>
  );
}
