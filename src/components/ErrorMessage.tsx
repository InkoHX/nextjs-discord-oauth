import React from 'react'

export interface ErrorMessageProps {
  readonly message: string
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="error-block">
      <p className="error-block-title">Error</p>
      <p className="error-block-message">{message}</p>
      <style jsx>{`
        .error-block {
          background-color: #ffcdd2;
          border-left: 8px solid #c00;
          padding: 12px 8px;
          margin: 1rem 0;
        }

        .error-block-title {
          font-weight: 600;
          text-transform: uppercase;
          margin: 0;
          color: #7f0000;
        }

        .error-block-message {
          margin-top: 16px;
          margin-bottom: 0;
        }
      `}</style>
    </div>
  )
}
