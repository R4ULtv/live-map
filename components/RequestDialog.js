import { Button, Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { getCountryData } from "countries-list";

export default function RequestDialog({ requestInfo, isOpen, setIsOpen }) {
  const country = getCountryData(requestInfo.country);
  return (
    <Dialog
      transition
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition duration-150 ease-in-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          transition
          className="max-w-lg w-full border space-y-4 bg-zinc-100 dark:bg-zinc-900 border-zinc-200 first:pt-6 last:pb-4 dark:border-zinc-800 rounded-xl transition duration-150 ease-in-out data-[closed]:opacity-0 data-[closed]:scale-90"
        >
          <div className="flex items-center justify-between text-sm font-semibold text-zinc-400 px-6">
            <div className="flex items-center gap-2">
              <img
                className="w-7 h-auto rounded"
                src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${requestInfo.country}.svg`}
              />
              <p>{requestInfo.city}</p>
            </div>
            <p>{requestInfo.country}</p>
          </div>

          <div className="bg-zinc-800 w-full h-0.5 rounded"></div>

          <div className="px-6">
            <p className="text-zinc-400 font-semibold text-sm mb-1">
              Geolocation Data
            </p>
            <div className="space-y-2 text-zinc-300">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Latitude</span>
                  <span>{requestInfo.latitude}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Longitude</span>
                  <span>{requestInfo.longitude}</span>
                </div>
              </div>

              <div className="bg-zinc-800 w-full h-px"></div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Country</span>
                  <span>{country.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">City</span>
                  <span>{requestInfo.city}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 w-full h-0.5 rounded"></div>

          <div className="px-6">
            <p className="text-zinc-400 font-semibold text-sm mb-1">
              Country General Information
            </p>
            <div className="space-y-2 text-zinc-300">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Languages</span>
                  <span className="uppercase">
                    {country.languages.join(", ")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Currency</span>
                  <span>{country.currency.join(", ")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Phone Code</span>
                  <div>
                    {country.phone.map((phone, idx) => (
                      <span key={idx}>+{phone}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Capital</span>
                  <span>{country.capital}</span>
                </div>
              </div>

              <div className="bg-zinc-800 w-full h-px"></div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">ISO 2</span>
                  <span>{country.iso2}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">ISO 3</span>
                  <span>{country.iso3}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 w-full h-0.5 rounded"></div>
          <div className="px-6">
            <Button
              onClick={() => setIsOpen(false)}
              className={
                "bg-zinc-800 text-zinc-200 font-semibold tracking-wide border border-zinc-700 w-full py-2 rounded"
              }
            >
              Close
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
