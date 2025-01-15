import React from "react";
import { ValidationResult } from "../../../backend/src/types/ocpi";
import { Divider } from "@nextui-org/divider";

interface Props {
  result: ValidationResult;
}

export const ValidationResults: React.FC<Props> = ({ result }) => {
  return (
    <div className="mt-6 space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold text-white mb-4">Validation Results</h2>

      {result.isValid ? (
        <div className="flex items-center text-green-400 p-4">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
          All tariffs match ENAPI's OCPI implementation
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center text-red-400 p-4">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            Discrepancies found between CPO data and ENAPI's OCPI implementation
          </div>

          <div className="space-y-6">
            {result.discrepancies.map((discrepancy, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-bold text-red-400 flex items-center">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                  {discrepancy.field}
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="text-gray-300">
                    <span className="font-semibold text-gray-200"></span>{" "}
                    {discrepancy.message}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="block font-semibold text-green-400">
                        Expected
                      </span>
                      <span className="text-gray-300">
                        {discrepancy.expected}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="block font-semibold text-red-400">
                        Actual
                      </span>
                      <span className="text-gray-300">
                        {discrepancy.actual}
                      </span>
                    </div>
                  </div>
                </div>

                {index < result.discrepancies.length - 1 && (
                  <Divider className="mt-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
