import {
  Button,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { ChartBarIcon, IdentificationIcon } from "@heroicons/react/16/solid";
import { getCountryData } from "countries-list";
import { useState } from "react";

export default function CountryData({ requestInfo, countryCode }) {
  const [copiedText, setCopiedText] = useState("");
  const country = getCountryData(
    requestInfo ? requestInfo.country : countryCode
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text);
      setTimeout(() => setCopiedText(""), 2000);
    });
  };

  const CopyButton = ({ text, rawText }) => (
    <Button
      onClick={() => copyToClipboard(rawText ? rawText : text)}
      className="hover:bg-zinc-700 focus:bg-zinc-700 px-2 rounded transition-colors outline-none"
    >
      {text}
      {copiedText === text && (
        <span className="ml-2 text-xs text-green-400">Copied!</span>
      )}
    </Button>
  );

  return (
    <TabGroup
      className="space-y-2"
    >
      <div className="overflow-hidden h-10 relative">
        <img
          className="w-full h-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4"
          alt={country.name}
          src={
            "https://purecatamphetamine.github.io/country-flag-icons/3x2/" +
            country.iso2 +
            ".svg"
          }
        />
      </div>
      <TabList className="flex items-center justify-between px-1 border-b border-zinc-800 pb-2">
        <Tab className="px-2 py-1 rounded-md hover:bg-zinc-800 data-[selected]:bg-zinc-800 text-zinc-300 text-sm flex items-center gap-1 outline-none">
          <IdentificationIcon className="size-4" />
          General Information
        </Tab>
        <Tab className="px-2 py-1 rounded-md hover:bg-zinc-800 data-[selected]:bg-zinc-800 text-zinc-300 text-sm flex items-center gap-1 outline-none">
          <ChartBarIcon className="size-4" />
          Statistics
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          {requestInfo && (
            <>
              <div className="px-4">
                <p className="text-zinc-400 font-semibold text-sm mb-1">
                  Request Data
                </p>
                <div className="space-y-2 text-zinc-300">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Latitude</span>
                      <CopyButton text={requestInfo.latitude.toString()} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Longitude</span>
                      <CopyButton text={requestInfo.longitude.toString()} />
                    </div>
                  </div>

                  <div className="bg-zinc-800 w-full h-px"></div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Country Code</span>
                      <CopyButton text={requestInfo.country} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Region</span>
                      <CopyButton text={requestInfo.region} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">City</span>
                      <CopyButton text={requestInfo.city} />
                    </div>
                  </div>

                  <div className="bg-zinc-800 w-full h-px"></div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Request Date</span>
                      <CopyButton
                        text={requestInfo.createdAt.toLocaleString()}
                        rawText={requestInfo.createdAt.toISOString()}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Request ID</span>
                      <CopyButton text={requestInfo.requestID} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-800 w-full h-0.5 rounded"></div>
            </>
          )}
          <div className="px-4">
            <p className="text-zinc-400 font-semibold text-sm mb-1">
              Country General Information
            </p>
            <div className="space-y-2 text-zinc-300">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Country</span>
                  <CopyButton text={country.name} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Capital</span>
                  <CopyButton text={country.capital} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Continent Code</span>
                  <CopyButton text={country.continent} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Languages</span>
                  <CopyButton text={country?.languages.join(", ")} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Currency</span>
                  <CopyButton text={country.currency.join(", ")} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Phone Code</span>
                  <CopyButton
                    text={country.phone.map((phone) => `+${phone}`).join(", ")}
                  />
                </div>
              </div>

              <div className="bg-zinc-800 w-full h-px"></div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">ISO Alpha-2</span>
                  <CopyButton text={country.iso2} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">ISO Alpha-3</span>
                  <CopyButton text={country.iso3} />
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="flex items-center justify-center h-40 mx-2 border border-zinc-800 rounded-md">
            <div className="p-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 ring-1 ring-zinc-500 rounded-md">
              <ChartBarIcon className="size-6" />
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
