import os


def getSourceOrigins() -> list[str]:
    result = []
    for inside in os.listdir("./src"):
        if not inside == "all.ts" and inside.endswith(".ts"):
            result.append(inside)
    return result


def cleanLine(line: str) -> str:
    result = line.strip()
    while result.find("  ") > -1:
        result = result.replace("  ", " ")
    return result


def getOriginLines(origin: str) -> list[str]:
    reader = open('src/' + origin, 'r')
    result = reader.readlines()
    reader.close()
    return result


def saveAllFile(lines: list[str]):
    writer = open('src/all.ts', 'w')
    writer.writelines(lines)
    writer.close()


def getIdentifier(onLine: str, ofStarter: str) -> str:
    if onLine.startswith(ofStarter): 
        endSpc = onLine.find(" ", len(ofStarter) +1)
        if endSpc == -1:
            endSpc = len(onLine)
        endPar = onLine.find("(", len(ofStarter) +1)
        if endPar == -1:
            endPar = len(onLine)
        return onLine[len(ofStarter) : endPar if endPar < endSpc else endSpc]
    return ""


def getOriginExports(origin: str) -> list[str]:
    result = []
    reader = open('src/' + origin, 'r')
    for line in reader:
        line = cleanLine(line)
        identifier = getIdentifier(line, "export class ")
        if identifier:
            result.append(identifier)
        identifier = getIdentifier(line, "export enum ")
        if identifier:
            result.append(identifier)
        identifier = getIdentifier(line, "export type ")
        if identifier:
            result.append(identifier)
        identifier = getIdentifier(line, "export interface ")
        if identifier:
            result.append(identifier)
        identifier = getIdentifier(line, "export function ")
        if identifier:
            result.append(identifier)
        identifier = getIdentifier(line, "export const ")
        if identifier:
            result.append(identifier)
    reader.close()
    return result


def getOriginFrom(origin: str) -> str:
    result = " } from \"./"
    pos = origin.rfind(".")
    if pos > -1:
        origin = origin[0:pos]
    result += origin
    result += "\";\n"
    return result


if __name__ == "__main__":
    lines = []
    for origin in getSourceOrigins():
        exports = getOriginExports(origin)
        if exports:
            exportLine = "export { "
            first = True
            counter = 0
            for export in exports:
                if not first:
                    exportLine += ", "
                else:
                    first = False
                if counter == 3:
                    exportLine += "\n         "
                    counter = 0
                exportLine += export
                counter += 1
            exportLine += getOriginFrom(origin)
            exportLine += "\n"
            lines.append(exportLine);
    saveAllFile(lines)
    print("Finish to generate the source code of src/all.ts")
