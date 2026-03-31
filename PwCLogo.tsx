export default function PwCLogo() {
  return (
    <div className="flex items-center">
      <span
        className="font-bold"
        style={{
          fontSize: '22px',
          color: '#D04A02',
          fontFamily: 'sans-serif',
          letterSpacing: '-0.5px'
        }}
      >
        PwC
      </span>
      <div
        className="mx-2.5"
        style={{
          width: '1px',
          height: '16px',
          backgroundColor: 'var(--color-card-border)'
        }}
      />
      <span
        className="font-normal"
        style={{
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
          fontFamily: 'sans-serif'
        }}
      >
        Middle East
      </span>
    </div>
  );
}
