import escapeHtml from "../../util/html-escape";

export default function Text({ children, editable, ...props }) {
  if (typeof children === "string") {
    return (
      <text
        x="0"
        y="0"
        style={
          editable
            ? {
              cursor: "pointer",
            }
            : null
        }
        className={
          editable
            ? 'hover:text-orange-400 font-semibold'
            : 'font-semibold'
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
      style={
        editable
          ? {
            cursor: "pointer",
          }
          : null
      }
      className={
        editable
          ? 'hover:text-orange-400 font-semibold'
          : 'font-semibold'
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
