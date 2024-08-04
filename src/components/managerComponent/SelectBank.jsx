import { useEffect, useMemo, useState } from "react";
import { uuid } from "../../utils/uuid";
import { classNames } from "../../utils/classNames";
import PropTypes from "prop-types";

export const SelectBank = ({ options, value, onChange, onChangeBin }) => {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const [id] = useState(uuid());

    useEffect(() => {
        function handleOutsideClick(e) {
            if (
                !e.target.closest(`#Toggle-${id}`) &&
                !e.target.closest(`#Select-${id}`)
            )
                setOpen(false);
        }

        document.addEventListener("mousedown", handleOutsideClick);

        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [id]);

    const opt = useMemo(() => {
        // Quản lý tìm kiếm và options
        const OPTIONS = options.filter(
            (o) =>
                ((o.name.toLowerCase().indexOf(search.toString().toLowerCase()) !==-1)||(o.shortName.toString().toLowerCase().indexOf(search.toString().toLowerCase()) !==-1))
        );

        return OPTIONS.length > 0
            ? OPTIONS.map((o, i) => (
                <div
                    key={i}
                    className="px-3 py-1 cursor-pointer text-neutral-600 hover:bg-neutral-300"
                    onClick={() => {
                        onChange(o.name);
                        onChangeBin(o?.bin);
                        setOpen(false);
                    }}
                >
                    {o.name}
                </div>
            ))
            : [
                <div
                    key={"not-found"}
                    className="px-3 py-1 cursor-pointer text-neutral-600 hover:bg-neutral-300"
                    onClick={() => {
                        onChange("");
                        setOpen(false);
                    }}
                >
                    Không tìm thấy
                </div>,
            ];
    }, [options, search, onChange]);

    
    useMemo(() => setSearch(value), [value]);

    return (
        <div
            id={`Select-${id}`}
            className="relative flex flex-col items-center justify-center"
        >
            <div className="flex items-center justify-between divide-x divide-neutral-200 gap-1 border border-neutral-400 rounded-md overflow-hidden w-full">
                <input
                    className="outline-none px-2 w-full p-2 bg-gray-50 text-gray-900 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Tìm kiếm..."
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setOpen(true)}
                />
                <span
                    className="relative p-4 cursor-pointer"
                    onClick={() => setOpen((p) => !p)}
                    id={`Toggle-${id}`}
                >
                    <span
                        className={classNames(
                            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[6px] border-l-transparent border-r-transparent border-b-0 border-t-neutral-900 transition-[transform]",
                            open ? "rotate-180" : "rotate-0"
                        )}
                    ></span>
                </span>
            </div>
            <div
                id="options"
                className={classNames(
                    "absolute top-10 border-neutral-400 w-full rounded-md overflow-auto transition-all bg-white",
                    open ? "max-h-40 border" : "max-h-0 border-0"
                )}
            >
                {opt}
            </div>
        </div>
    );
};

SelectBank.propTypes = {
    options: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

SelectBank.defaultProps = {
    options: [],
    value: "",
    onChange: () => {},
};